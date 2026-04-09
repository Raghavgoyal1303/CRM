const crypto = require('crypto');
const { randomUUID } = require('crypto');

const developerController = {
  listKeys: async (req, res) => {
    try {
      let sql = 'SELECT id, name, description, key_preview, permissions, environment, is_active, rate_limit, calls_this_month, last_used_at, created_at FROM api_keys';
      let params = [];

      if (req.user.role !== 'superadmin') {
        sql += ' WHERE company_id = ?';
        params.push(req.user.company_id);
      }
      
      sql += ' ORDER BY created_at DESC';
      const result = await query(sql, params);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  generateKey: async (req, res) => {
    try {
      const { name, description, permissions, environment, rate_limit, expires_at } = req.body;
      const keyId = randomUUID();
      
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
      let sql = 'UPDATE api_keys SET is_active = 0, revoked_at = NOW(), revoked_by = ? WHERE id = ?';
      let params = [req.user.id, id];

      if (req.user.role !== 'superadmin') {
        sql += ' AND company_id = ?';
        params.push(req.user.company_id);
      }

      await query(sql, params);
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
      bridge: 'Tricity Verified Developer Protocol',
      timestamp: new Date().toISOString(),
      message: 'Strategic developer connectivity verified.'
    });
  }
};

module.exports = developerController;
