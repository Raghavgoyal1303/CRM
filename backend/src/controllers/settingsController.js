const db = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * Get company profile
 */
exports.getCompanySettings = async (req, res) => {
  const { company_id } = req.user;
  try {
    const { rows } = await db.query('SELECT * FROM companies WHERE id = ?', [company_id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Company not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Update company identifier profile
 */
exports.updateCompanySettings = async (req, res) => {
  const { company_id } = req.user;
  const { name, owner_email } = req.body;
  try {
    await db.query('UPDATE companies SET name = ?, owner_email = ? WHERE id = ?', [name, owner_email, company_id]);
    res.json({ message: 'Identity profile synced' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Handle Admin credential update with hashing
 */
exports.updateAdminPassword = async (req, res) => {
  const { newPassword } = req.body;
  try {
    const password_hash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE employees SET password_hash = ? WHERE id = ?', [password_hash, req.user.id]);
    res.json({ message: 'Personnel credentials secured' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
