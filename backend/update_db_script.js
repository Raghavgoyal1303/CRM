require('dotenv').config({ path: './backend/.env' });
const mysql = require('mysql2/promise');

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'Tricity Verified_db',
    port: process.env.DB_PORT || 3306,
  });

  try {
    const conn = await pool.getConnection();
    console.log('âœ… Connected to DB');
    
    await conn.query('ALTER TABLE employees ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20)');
    console.log('âœ… phone_number column checked');
    
    await conn.query(`
      CREATE TABLE IF NOT EXISTS otp_tokens (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        employee_id CHAR(36) NOT NULL,
        otp_code VARCHAR(6) NOT NULL,
        expires_at DATETIME NOT NULL,
        is_used TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id)
      )
    `);
    console.log('âœ… otp_tokens table checked');
    
    conn.release();
    console.log('ðŸš€ DB Schema Sync Complete');
    process.exit(0);
  } catch (err) {
    console.error('âŒ DB Error:', err.message);
    process.exit(1);
  }
}

run();

