const db = require('../config/db');
const { randomUUID } = require('crypto');

exports.getBlacklist = async (req, res) => {
  const { company_id } = req.user;
  try {
    const { rows } = await db.query(
      'SELECT id, phone_number, reason, created_at FROM blacklist WHERE company_id = ? ORDER BY created_at DESC',
      [company_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addToBlacklist = async (req, res) => {
  const { company_id } = req.user;
  const { phone_number, reason } = req.body;
  const id = randomUUID();
  try {
    // Check for existing records
    const { rows: exists } = await db.query('SELECT id FROM blacklist WHERE company_id = ? AND phone_number = ?', [company_id, phone_number]);
    if (exists.length > 0) return res.status(400).json({ message: 'Caller already excluded' });

    await db.query(
      'INSERT INTO blacklist (id, company_id, phone_number, reason) VALUES (?, ?, ?, ?)',
      [id, company_id, phone_number, reason || 'Manual']
    );
    res.status(201).json({ id, message: 'Number added to exclusion list' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.removeFromBlacklist = async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user;
  try {
    await db.query('DELETE FROM blacklist WHERE id = ? AND company_id = ?', [id, company_id]);
    res.json({ message: 'Caller reinstated' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
