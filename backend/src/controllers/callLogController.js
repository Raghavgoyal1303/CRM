const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getCallLogs = async (req, res) => {
  const { company_id } = req.user;
  try {
    const { rows } = await db.query(
      'SELECT id, phone_number, call_status, duration, direction, created_at FROM call_logs WHERE company_id = ? ORDER BY created_at DESC',
      [company_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.logCall = async (req, res) => {
  const { company_id } = req.user;
  const { phone_number, call_status, duration, direction } = req.body;
  const id = uuidv4();
  try {
    await db.query(
      'INSERT INTO call_logs (id, company_id, phone_number, call_status, duration, direction) VALUES (?, ?, ?, ?, ?, ?)',
      [id, company_id, phone_number, call_status, duration || 0, direction || 'outbound']
    );
    res.status(201).json({ id, message: 'Call record synchronized' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
