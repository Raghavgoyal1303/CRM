const { query, transaction } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

exports.getEmployees = async (req, res) => {
  const { company_id } = req.user;
  try {
    const { rows } = await query(
      'SELECT id, name, email, role, created_at, is_active FROM employees WHERE company_id = ? AND role = "employee" AND deleted_at IS NULL ORDER BY created_at DESC',
      [company_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('getEmployees error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createEmployee = async (req, res) => {
  const { company_id, id: user_id } = req.user;
  const { name, email, password } = req.body;
  const id = uuidv4();
  
  try {
    await transaction(async (connection) => {
      // 1. Check if email already exists
      const [existing] = await connection.query('SELECT id FROM employees WHERE email = ?', [email]);
      if (existing.length > 0) throw new Error('Email already exists');

      // 2. Hash password with bcrypt
      const password_hash = await bcrypt.hash(password, 10);

      // 3. Insert new employee
      await connection.query(
        'INSERT INTO employees (id, company_id, name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, "employee", 1)',
        [id, company_id, name, email, password_hash]
      );

      // 4. Log activity
      await connection.query(
        'INSERT INTO activity_logs (id, company_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), company_id, user_id, 'Employee Onboarded', JSON.stringify({ name, email })]
      );
    });
    
    res.status(201).json({ id, message: 'Employee successfully onboarded' });
  } catch (err) {
    if (err.message === 'Email already exists') {
        return res.status(400).json({ message: err.message });
    }
    console.error('createEmployee error:', err);
    res.status(500).json({ message: 'Internal Server Error: ' + err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user;
  try {
    await query('UPDATE employees SET deleted_at = NOW() WHERE id = ? AND company_id = ? AND role = "employee"', [id, company_id]);
    res.json({ message: 'Access revoked (Soft Delete)' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  const { company_id } = req.user;
  try {
    const password_hash = await bcrypt.hash(newPassword, 10);
    await query(
      'UPDATE employees SET password_hash = ? WHERE id = ? AND company_id = ? AND role = "employee"',
      [password_hash, id, company_id]
    );
    res.json({ message: 'Passwords reset and hashed successful' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
