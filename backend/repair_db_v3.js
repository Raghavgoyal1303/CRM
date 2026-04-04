const mysql = require('mysql2/promise');
require('dotenv').config();

async function repair() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'leadflow_db'
  });

  try {
    console.log('Repairing DB Schema...');
    
    // 1. Add started_at if it doesn't exist
    const [cols] = await connection.query('DESCRIBE outbound_campaigns');
    if (!cols.find(c => c.Field === 'started_at')) {
      await connection.query('ALTER TABLE outbound_campaigns ADD COLUMN started_at DATETIME AFTER created_at');
      console.log('+ Column started_at added to outbound_campaigns');
    }

    // 2. Ensure activity_logs exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id VARCHAR(255) PRIMARY KEY,
        company_id VARCHAR(255),
        user_id VARCHAR(255),
        action VARCHAR(255),
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('+ Table activity_logs verified');

    // 3. Ensure outbound_numbers exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS outbound_numbers (
        id VARCHAR(255) PRIMARY KEY,
        company_id VARCHAR(255),
        campaign_id VARCHAR(255),
        phone_number VARCHAR(20),
        last_call_status VARCHAR(50),
        FOREIGN KEY (campaign_id) REFERENCES outbound_campaigns(id)
      )
    `);
    console.log('+ Table outbound_numbers verified');

  } catch (err) {
    console.error('Repair Error:', err.message);
  } finally {
    await connection.end();
  }
}

repair();
