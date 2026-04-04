const crypto = require('crypto');
const { query } = require('../config/db');

const apiKeyAuth = async (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (!key) {
    return res.status(401).json({
      error: 'API key required',
      hint: 'Add X-API-Key header to your request'
    });
  }

  if (!key.startsWith('lf_live_') && !key.startsWith('lf_test_')) {
    return res.status(401).json({ error: 'Invalid API key format' });
  }

  const keyHash = crypto.createHash('sha256').update(key).digest('hex');

  const result = await query(
    `SELECT ak.*, c.subscription_status
     FROM api_keys ak
     JOIN companies c ON ak.company_id = c.id
     WHERE ak.key_hash = ? AND ak.is_active = 1`,
    [keyHash]
  );

  if (!result.rows[0]) {
    return res.status(401).json({ error: 'Invalid or revoked API key' });
  }

  const apiKey = result.rows[0];

  if (apiKey.subscription_status === 'suspended') {
    return res.status(403).json({ error: 'Company subscription suspended' });
  }

  if (apiKey.expires_at && new Date(apiKey.expires_at) < new Date()) {
    return res.status(401).json({ error: 'API key expired' });
  }

  if (apiKey.calls_this_month >= apiKey.rate_limit) {
    return res.status(429).json({
      error: 'Monthly rate limit exceeded',
      limit: apiKey.rate_limit,
      used: apiKey.calls_this_month
    });
  }

  req.companyId = apiKey.company_id;
  req.apiKey = apiKey;
  req.apiPermissions = JSON.parse(apiKey.permissions || '{}');

  // Set virtual user for controller compatibility
  req.user = {
    id: apiKey.created_by, // Or a system ID
    company_id: apiKey.company_id,
    role: 'api'
  };

  // Async update logs without blocking response
  query(
    `UPDATE api_keys
     SET last_used_at = NOW(),
         last_used_ip = ?,
         calls_this_month = calls_this_month + 1
     WHERE id = ?`,
    [req.ip, apiKey.id]
  ).catch(console.error);

  query(
    `INSERT INTO api_request_logs
     (id, company_id, api_key_id, method, endpoint, ip_address, created_at)
     VALUES (UUID(), ?, ?, ?, ?, ?, NOW())`,
    [apiKey.company_id, apiKey.id, req.method, req.path, req.ip]
  ).catch(console.error);

  next();
};

const requirePermission = (resource, action) => {
  return (req, res, next) => {
    const perms = req.apiPermissions[resource] || [];
    if (!perms.includes(action)) {
      return res.status(403).json({
        error: `Permission denied`,
        required: `${resource}:${action}`,
        hint: 'Regenerate your API key with the correct permissions'
      });
    }
    next();
  };
};

module.exports = { apiKeyAuth, requirePermission };
