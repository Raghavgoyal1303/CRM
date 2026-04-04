const crypto = require('crypto');
const { query } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const developerController = {
  listKeys: async (req, res) => {
    try {
      const result = await query(
        'SELECT id, name, description, key_preview, permissions, environment, is_active, rate_limit, calls_this_month, last_used_at, created_at FROM api_keys WHERE company_id = ? ORDER BY created_at DESC',
        [req.user.company_id]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  generateKey: async (req, res) => {
    try {
      const { name, description, permissions, environment, rate_limit, expires_at } = req.body;
      const keyId = uuidv4();
      
      // Generate the raw key
      const prefix = environment === 'test' ? 'lf_test_' : 'lf_live_';
      const randomString = crypto.randomBytes(32).toString('hex');
      const rawKey = prefix + randomString;
      
      const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
      const keyPreview = `${prefix}${randomString.substring(0, 4)}...${randomString.substring(randomString.length - 4)}`;

      await query(
        `INSERT INTO api_keys 
        (id, company_id, name, description, key_hash, key_preview, permissions, environment, rate_limit, expires_at, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [keyId, req.user.company_id, name, description, keyHash, keyPreview, JSON.stringify(permissions), environment || 'live', rate_limit || 1000, expires_at || null, req.user.id]
      );

      // Important: Only return the raw key ONCE
      res.status(201).json({
        id: keyId,
        message: 'API Key generated successfully. Save it now; it will never be shown again.',
        key: rawKey
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  revokeKey: async (req, res) => {
    try {
      const { id } = req.params;
      await query(
        'UPDATE api_keys SET is_active = 0, revoked_at = NOW(), revoked_by = ? WHERE id = ? AND company_id = ?',
        [req.user.id, id, req.user.company_id]
      );
      res.json({ message: 'API Key revoked' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getUsageLogs: async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;

      const result = await query(
        'SELECT * FROM api_request_logs WHERE api_key_id = ? AND company_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [id, req.user.company_id, parseInt(limit), parseInt(offset)]
      );
      
      const total = await query('SELECT COUNT(*) as count FROM api_request_logs WHERE api_key_id = ?', [id]);

      res.json({
        logs: result.rows,
        pagination: {
          total: total.rows[0].count,
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  ping: async (req, res) => {
    res.json({
      status: 'active',
      bridge: 'LeadFlow Developer Protocol',
      timestamp: new Date().toISOString(),
      message: 'Strategic developer connectivity verified.'
    });
  }
};

module.exports = developerController;
