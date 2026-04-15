const mysql = require('mysql2/promise');
require('dotenv').config();

async function debug() {
  console.log('Connecting to:', process.env.DB_HOST);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    });

    console.log('CONNECTED! Attempting table creation...');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id VARCHAR(36) PRIMARY KEY,
        company_id VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(15, 2),
        location VARCHAR(255) NOT NULL,
        property_type VARCHAR(100) NOT NULL,
        ownership VARCHAR(100) NOT NULL,
        details JSON,
        media JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_company_type (company_id, property_type),
        INDEX idx_location (location)
      )
    `);
    
    console.log('SUCCESS: Table properties is now ready!');
    await connection.end();
  } catch (err) {
    console.error('DATABASE ERROR:', err.message);
    process.exit(1);
  }
}

debug();
