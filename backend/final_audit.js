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
    const [leadsFields] = await pool.execute('DESCRIBE leads');
    console.log('--- LEADS COLUMNS ---');
    leadsFields.forEach(f => console.log(f.Field));

    const [fuFields] = await pool.execute('DESCRIBE follow_ups');
    console.log('\n--- FOLLOW_UPS COLUMNS ---');
    fuFields.forEach(f => console.log(f.Field));

    process.exit(0);
  } catch (err) {
    console.error('Audit failed:', err.message);
    process.exit(1);
  }
}
audit();
