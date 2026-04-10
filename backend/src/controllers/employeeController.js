const { query, transaction } = require('../config/db');
const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');

exports.getEmployees = async (req, res) => {
  const { company_id } = req.user;
    // Use IST Date (UTC+5:30) for the is_online check
    const nowIST = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
    const today = nowIST.toISOString().split('T')[0];

    try {
      // Join with Attendance to determine real-time "Online" status
      // Rule: Green only if clocked-in TODAY + No clock-out + Photo exists
      const { rows } = await query(`
        SELECT 
          e.id, e.name, e.email, e.role, e.created_at, e.is_active, e.acefone_extension,
          CASE 
            WHEN a.id IS NOT NULL AND a.clock_out IS NULL AND a.photo_url IS NOT NULL THEN 1 
            ELSE 0 
          END as is_online
        FROM employees e
        LEFT JOIN attendance a ON e.id = a.user_id AND a.date = ?
        WHERE e.company_id = ? AND e.role = 'employee' AND e.deleted_at IS NULL 
        ORDER BY e.created_at DESC
      `, [today, company_id]);
    res.json(rows);
  } catch (err) {
    console.error('getEmployees error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createEmployee = async (req, res) => {
  const { company_id, id: user_id } = req.user;
  const { name, email, password, phone_number, acefone_extension } = req.body;
  const id = randomUUID();
  
  try {
    await transaction(async (connection) => {
      // 1. Check if email already exists
      const [existing] = await connection.query('SELECT id FROM employees WHERE email = ?', [email]);
      if (existing.length > 0) throw new Error('Email already exists');

      // 2. Hash password with bcrypt
      const password_hash = await bcrypt.hash(password, 10);

      // 3. Insert new employee
      await connection.query(
        `INSERT INTO employees (id, company_id, name, email, phone_number, password_hash, role, is_active, acefone_extension) VALUES (?, ?, ?, ?, ?, ?, 'employee', 1, ?)`,
        [id, company_id, name, email, phone_number, password_hash, acefone_extension]
      );

      // 4. Log activity
      await connection.query(
        'INSERT INTO activity_logs (id, company_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [randomUUID(), company_id, user_id, 'Employee Onboarded', JSON.stringify({ name, email })]
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
    await query(`UPDATE employees SET deleted_at = NOW() WHERE id = ? AND company_id = ? AND role = 'employee'`, [id, company_id]);
    res.json({ message: 'Access revoked (Soft Delete)' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { is_active, name, acefone_extension } = req.body;
  const { company_id } = req.user;
  try {
    const fields = [];
    const params = [];

    if (is_active !== undefined) {
      fields.push('is_active = ?');
      params.push(is_active);
    }
    if (name) {
      fields.push('name = ?');
      params.push(name);
    }
    if (acefone_extension) {
      fields.push('acefone_extension = ?');
      params.push(acefone_extension);
    }

    if (fields.length === 0) return res.status(400).json({ message: 'No fields provided for update' });

    params.push(id, company_id);
    await query(`UPDATE employees SET ${fields.join(', ')} WHERE id = ? AND company_id = ? AND role = 'employee'`, params);
    
    res.json({ message: 'Employee profile updated' });
  } catch (err) {
    console.error('updateEmployee error:', err);
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
      `UPDATE employees SET password_hash = ? WHERE id = ? AND company_id = ? AND role = 'employee'`,
      [password_hash, id, company_id]
    );
    res.json({ message: 'Passwords reset and hashed successful' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
