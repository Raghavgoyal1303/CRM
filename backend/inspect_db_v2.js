const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'leadflow_db'
  });

  try {
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tables:', tables.map(t => Object.values(t)[0]));

    for (const table of ['users', 'employees', 'leads', 'outbound_campaigns']) {
        try {
            const [cols] = await connection.query(`DESCRIBE ${table}`);
            console.log(`\nColumns for ${table}:`, cols.map(c => c.Field));
        } catch (e) {
            console.log(`\nTable ${table} does not exist or error:`, e.message);
        }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

check();
