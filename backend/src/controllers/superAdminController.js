const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/**
 * Get global metrics for Super Admin
 */
exports.getGlobalStats = async (req, res) => {
  try {
    const { rows: companies } = await db.query('SELECT COUNT(*) as count FROM companies');
    const { rows: leads } = await db.query('SELECT COUNT(*) as count FROM leads');
    const { rows: employees } = await db.query('SELECT COUNT(*) as count FROM employees WHERE role = "employee"');
    
    // Total revenue simulation
    const totalRevenue = companies[0].count * 9.99;

    res.json({
      totalCompanies: companies[0].count,
      totalLeads: leads[0].count,
      totalEmployees: employees[0].count,
      totalRevenue: totalRevenue.toFixed(2),
      activeSyncNodes: 42
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * List all companies
 */
exports.getCompanies = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM companies ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Register new company and anchor admin account
 */
exports.createCompany = async (req, res) => {
  const { name, owner_email, plan } = req.body;
  const companyId = uuidv4();
  const ownerId = uuidv4();

  try {
    // 1. Create company
    await db.query(
      'INSERT INTO companies (id, name, owner_email, plan, status) VALUES (?, ?, ?, ?, "active")',
      [companyId, name, owner_email, plan || 'standard']
    );

    // 2. Hash default admin password
    const password_hash = await bcrypt.hash('admin123', 10);

    // 3. Create the initial admin user with password_hash
    await db.query(
      'INSERT INTO employees (id, company_id, name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, "admin", 1)',
      [ownerId, companyId, `${name} Admin`, owner_email, password_hash]
    );

    res.status(201).json({ id: companyId, message: 'Company created with default admin: admin123' });
  } catch (err) {
    console.error('createCompany error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Purge company account
 */
exports.deleteCompany = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM companies WHERE id = ?', [id]);
    await db.query('DELETE FROM employees WHERE company_id = ?', [id]);
    res.json({ message: 'Company and associated personnel purged' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Suspend/Unsuspend company
 */
exports.toggleSuspension = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query('UPDATE companies SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: `Access level set to ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Monitor global activity
 */
exports.getGlobalActivity = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT a.*, c.name as company_name 
      FROM activity_logs a 
      JOIN companies c ON a.company_id = c.id 
      ORDER BY a.created_at DESC LIMIT 100
    `);
    res.json(rows);
  } catch (err) {
     res.json([]);
  }
};

/**
 * Change Super Admin credentials
 */
exports.updatePassword = async (req, res) => {
  const { newPassword } = req.body;
  try {
    const password_hash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE employees SET password_hash = ? WHERE id = ?', [password_hash, req.user.id]);
    res.json({ message: 'Platform access secured' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
/**
 * Export history as CSV/PDF (Placeholder)
 */
exports.exportActivityReport = async (req, res) => {
  res.json({ message: 'Activity report compilation initiated' });
};
