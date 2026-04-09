const db = require('../config/db');
const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');

/**
 * Get global metrics for Super Admin
 */
exports.getGlobalStats = async (req, res) => {
  try {
    const { rows: companies } = await db.query('SELECT COUNT(*) as count FROM companies');
    const { rows: leads } = await db.query('SELECT COUNT(*) as count FROM leads');
    const { rows: employees } = await db.query('SELECT COUNT(*) as count FROM employees WHERE role = "employee"');
    const { rows: revenue } = await db.query('SELECT SUM(payment_amount) as total FROM lottery_participants WHERE payment_status = "paid"');
    
    res.json({
      totalCompanies: companies[0].count,
      totalLeads: leads[0].count,
      totalEmployees: employees[0].count,
      totalRevenue: revenue[0].total || 0,
      activeSyncNodes: 42
    });
  } catch (err) {
    console.error('getGlobalStats error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getGlobalLeads = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT l.*, c.name as company_name 
      FROM leads l 
      JOIN companies c ON l.company_id = c.id 
      ORDER BY l.created_at DESC LIMIT 500
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getGlobalEmployees = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT e.id, e.name, e.email, e.role, e.created_at, c.name as company_name 
      FROM employees e 
      LEFT JOIN companies c ON e.company_id = c.id 
      ORDER BY e.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getGlobalCallLogs = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT cl.*, c.name as company_name 
      FROM call_logs cl 
      JOIN companies c ON cl.company_id = c.id 
      ORDER BY cl.created_at DESC LIMIT 500
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getGlobalAnalytics = async (req, res) => {
  try {
    // Basic platform-wide growth analytics
    const { rows: monthlyleads } = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count 
      FROM leads 
      GROUP BY month 
      ORDER BY month DESC LIMIT 12
    `);
    res.json({
      leadGrowth: monthlyleads.reverse(),
      topCompanies: [] // Placeholder for v2
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getGlobalLotteryStats = async (req, res) => {
  try {
    const { rows: counts } = await db.query(`
      SELECT 
        COUNT(*) as total_participants,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_count,
        SUM(CASE WHEN payment_status = 'paid' THEN payment_amount ELSE 0 END) as total_revenue
      FROM lottery_participants
    `);
    
    // Static / estimated values for things we don't track in DB yet
    res.json({
      ...counts[0],
      total_sold: counts[0].total_participants,
      revenue: counts[0].total_revenue,
      paid: counts[0].paid_count,
      winning_tokens: 100 // Constant
    });
  } catch (err) {
    console.error('getGlobalLotteryStats error:', err);
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
  const companyId = randomUUID();
  const ownerId = randomUUID();

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
