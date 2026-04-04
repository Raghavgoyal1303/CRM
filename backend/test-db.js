const { Client } = require('pg');
require('dotenv').config();

async function test() {
  const connectionString = process.env.DATABASE_URL;
  console.log('Testing connection to:', connectionString);
  
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT current_user, current_database()');
    console.log('User:', res.rows[0].current_user);
    console.log('Database:', res.rows[0].current_database);
    
    const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables in public schema:', tables.rows.map(r => r.table_name).join(', '));
    
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
    if (err.code) console.error('Error code:', err.code);
  }
}

test();
