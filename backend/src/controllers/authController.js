const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Handle user login
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Check if employee exists and is active
    const { rows } = await db.query(
      'SELECT id, name, role, company_id, password_hash, is_active FROM employees WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    if (!user.is_active) {
       return res.status(403).json({ message: 'Account suspended. Contact your admin.' });
    }

    // 2. Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Fetch company name for the UI context
    let company_name = 'LeadFlow SAAS';
    if (user.role !== 'super_admin' && user.company_id) {
       const { rows: compRows } = await db.query('SELECT name FROM companies WHERE id = ?', [user.company_id]);
       if (compRows.length > 0) company_name = compRows[0].name;
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, company_id: user.company_id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    console.log('[Backend] Sending Login Response for user:', email, 'Token exists:', !!token);
    
    res.json({
      user: { id: user.id, name: user.name, role: user.role, company_id: user.company_id, company_name },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Get current authenticated user session
 */
exports.getMe = async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, role, company_id FROM employees WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = rows[0];
    let company_name = 'LeadFlow SAAS';
    if (user.role !== 'super_admin' && user.company_id) {
       const { rows: compRows } = await db.query('SELECT name FROM companies WHERE id = ?', [user.company_id]);
       if (compRows.length > 0) company_name = compRows[0].name;
    }

    res.json({ id: user.id, name: user.name, role: user.role, company_id: user.company_id, company_name });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Handle user logout
 */
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};
