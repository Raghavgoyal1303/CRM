const { query } = require('../config/db');

const leadLockController = {
  lockLead: async (req, res) => {
    try {
      const { id } = req.params; // lead_id
      const { duration = 5 } = req.body; // default 5 minutes
      const expiresAt = new Date(Date.now() + duration * 60000);

      // Try to acquire lock
      await query(
        'INSERT INTO lead_locks (id, lead_id, locked_by, expires_at) VALUES (UUID(), ?, ?, ?) ON DUPLICATE KEY UPDATE locked_by = IF(expires_at < NOW(), VALUES(locked_by), locked_by), expires_at = IF(expires_at < NOW(), VALUES(expires_at), expires_at)',
        [id, req.user.id, expiresAt]
      );

      const check = await query('SELECT * FROM lead_locks WHERE lead_id = ?', [id]);
      if (check.rows[0].locked_by !== req.user.id) {
        return res.status(423).json({ error: 'Lead is currently locked by another user' });
      }

      res.json({ message: 'Lead locked successfully', expires_at: expiresAt });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  releaseLock: async (req, res) => {
    try {
      const { id } = req.params;
      await query('DELETE FROM lead_locks WHERE lead_id = ? AND locked_by = ?', [id, req.user.id]);
      res.json({ message: 'Lead lock released' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  checkLock: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await query(
        'SELECT ll.*, e.name as locked_by_name FROM lead_locks ll JOIN employees e ON ll.locked_by = e.id WHERE ll.lead_id = ? AND ll.expires_at > NOW()',
        [id]
      );
      res.json(result.rows[0] || { locked: false });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = leadLockController;
