const { query } = require('../config/db');

const liveCallController = {
  startCall: async (req, res) => {
    try {
      const { company_id } = req.params;
      const { call_sid, caller_number, employee_id, lead_id, direction } = req.body;
      
      await query(
        `INSERT INTO live_calls (id, company_id, call_sid, caller_number, employee_id, lead_id, direction, status)
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, 'in-progress')
         ON DUPLICATE KEY UPDATE status = 'in-progress'`,
        [company_id, call_sid, caller_number, employee_id, lead_id, direction || 'inbound']
      );
      
      res.json({ message: 'Live call started' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  endCall: async (req, res) => {
    try {
      const { call_sid } = req.body;
      await query('DELETE FROM live_calls WHERE call_sid = ?', [call_sid]);
      res.json({ message: 'Live call ended' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  listLiveCalls: async (req, res) => {
    try {
      const { company_id } = req.user;
      const result = await query(
        `SELECT lc.*, e.name as employee_name, l.name as lead_name 
         FROM live_calls lc
         LEFT JOIN employees e ON lc.employee_id = e.id
         LEFT JOIN leads l ON lc.lead_id = l.id
         WHERE lc.company_id = ?`,
        [company_id]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = liveCallController;
