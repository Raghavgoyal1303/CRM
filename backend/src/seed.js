const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function seed() {
  try {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO employees (name, email, password_hash, role)
      VALUES ('Rahul Sharma', 'rahul@crm.com', $1, 'admin')
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = $1, role = 'admin';
    `;
    
    await pool.query(query, [hash]);
    console.log('Admin user seeded/updated successfully: rahul@crm.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
