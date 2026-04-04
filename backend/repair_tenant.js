const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'leadflow_db',
});

async function repair() {
  console.log('🛠️  Starting Explicit Tenant Repair...');
  try {
    const [companies] = await pool.execute('SELECT id, name FROM companies LIMIT 1');
    const [employees] = await pool.execute('SELECT id, name FROM employees LIMIT 1');

    if (companies.length === 0 || employees.length === 0) {
      console.error('❌ Error: Missing companies or employees table data.');
      process.exit(1);
    }

    const companyId = companies[0].id;
    const employeeId = employees[0].id;

    await pool.execute('UPDATE employees SET company_id = ? WHERE id = ?', [companyId, employeeId]);
    
    console.log(`✅ Success: Linked ${employees[0].name} to ${companies[0].name}`);
    console.log(`🔗 Company ID: ${companyId}`);
    console.log(`🔗 Employee ID: ${employeeId}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Repair Failed:', error.message);
    process.exit(1);
  }
}

repair();
