const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Try to connect to 'postgres' database first to create 'crm_db' if it doesn't exist
const adminPool = new Pool({
  connectionString: process.env.DATABASE_URL.replace('/crm_db', '/postgres')
});

async function setup() {
  try {
    console.log('Attempting to ensure database "crm_db" exists...');
    
    // Check if database exists
    const checkDb = await adminPool.query("SELECT 1 FROM pg_database WHERE datname='crm_db'");
    if (checkDb.rows.length === 0) {
      console.log('Creating database "crm_db"...');
      await adminPool.query('CREATE DATABASE crm_db');
    } else {
      console.log('Database "crm_db" already exists.');
    }
    await adminPool.end();

    console.log('Connecting to "crm_db" to create tables...');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon but be careful with functions/triggers (not using them yet)
    // For simplicity, we run the whole file or parts of it
    // Using a more robust way for schema execution:
    console.log('Executing schema.sql...');
    await pool.query(schemaSql);
    
    console.log('Applying final admin seed with verified bcrypt hash...');
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT INTO employees (name, email, password_hash, role)
      VALUES ('Rahul Sharma', 'rahul@crm.com', $1, 'admin')
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = $1, role = 'admin';
    `, [hash]);

    console.log('Local Database Setup Complete! 🚀');
    console.log('Ready to login: rahul@crm.com / admin123');
    await pool.end();
    process.exit(0);

  } catch (err) {
    console.error('Setup failed:', err.message);
    if (err.message.includes('authentication failed')) {
      console.error('\nTIP: Please check your DATABASE_URL in backend/.env');
      console.error('Make sure the password matches your local PostgreSQL "postgres" user.');
    }
    process.exit(1);
  }
}

setup();
