require('dotenv').config();
const db = require('./src/config/db');

async function inspect() {
  try {
    console.log('--- TABLE LISTING ---');
    const [tables] = await db.pool.execute('SHOW TABLES');
    console.log('Tables:', JSON.stringify(tables));

    console.log('\n--- EMPLOYEE SAMPLE ---');
    const [employees] = await db.pool.execute('SELECT id, name, email, role, is_active FROM employees LIMIT 5');
    console.log('Employees:', JSON.stringify(employees, null, 2));

    console.log('\n--- COMPANY SAMPLE ---');
    const [companies] = await db.pool.execute('SELECT id, name, email FROM companies LIMIT 5');
    console.log('Companies:', JSON.stringify(companies, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('❌ Inspection failed:', err);
    process.exit(1);
  }
}

inspect();
