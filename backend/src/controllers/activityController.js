const { query } = require('../config/db');
const { randomUUID } = require('crypto');

/**
 * Access company-wide activity history
 */
exports.getActivityLogs = async (req, res) => {
  const { company_id, role, id: user_id } = req.user;
  try {
    let sql = 'SELECT a.*, u.name as user_name FROM activity_logs a LEFT JOIN employees u ON a.user_id = u.id WHERE a.company_id = ?';
    const params = [company_id];

    if (role === 'employee') {
      sql += ' AND a.user_id = ?';
      params.push(user_id);
    }

    sql += ' ORDER BY a.created_at DESC LIMIT 50';

    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Log internal events
 */
exports.logActivity = async (req, res) => {
  const { company_id, id: user_id } = req.user;
  const { action, details } = req.body;
  const id = randomUUID();
  try {
    await db.query(
      'INSERT INTO activity_logs (id, company_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
      [id, company_id, user_id, action, JSON.stringify(details || {})]
    );
    res.status(201).json({ id, success: true });
  } catch (err) {
     res.status(200).json({ success: false });
  }
};
