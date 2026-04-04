const db = require('./src/config/db');

async function test() {
  try {
    const res = await db.query('SELECT 1 as result');
    console.log('✅ Connection Successful:', res.rows);
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
  }
  process.exit(0);
}

test();
