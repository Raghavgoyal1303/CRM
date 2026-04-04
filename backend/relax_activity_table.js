const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'leadflow_db',
});

async function relaxConstraint() {
  console.log('🛠️  Relaxing Activity Log Constraint...');
  try {
    const sql = `ALTER TABLE activity_logs MODIFY user_id CHAR(36) NULL;`;
    await pool.execute(sql);
    console.log('✅ activity_logs table successfully relaxed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Table modification failed:', error.message);
    process.exit(1);
  }
}

relaxConstraint();
