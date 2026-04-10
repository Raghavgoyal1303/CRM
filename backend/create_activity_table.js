const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'Tricity Verified_db',
});

async function createTable() {
  console.log('ðŸ—ï¸  Creating Missing Activity Table...');
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS activity_logs (
        id CHAR(36) PRIMARY KEY,
        company_id CHAR(36) NOT NULL,
        user_id CHAR(36) NULL,
        action VARCHAR(255) NOT NULL,
        details TEXT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_company (company_id),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.execute(sql);
    console.log('âœ… activity_logs table created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('âŒ Table creation failed:', error.message);
    process.exit(1);
  }
}

createTable();

