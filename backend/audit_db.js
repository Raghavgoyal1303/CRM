const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function audit() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('--- LEADS SCHEMA ---');
    const [leadsFields] = await pool.execute('DESCRIBE leads');
    console.log(JSON.stringify(leadsFields, null, 2));

    console.log('\n--- FOLLOW_UPS SCHEMA ---');
    const [fuFields] = await pool.execute('DESCRIBE follow_ups');
    console.log(JSON.stringify(fuFields, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Audit failed:', err.message);
    process.exit(1);
  }
}
audit();
