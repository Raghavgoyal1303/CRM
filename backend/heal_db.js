require('dotenv').config();
const db = require('./src/config/db');

async function heal() {
  try {
    const result = await db.query('UPDATE employees SET is_active = 1 WHERE is_active IS NULL OR is_active = 0');
    console.log(`✅ Database healed! Records updated: ${result.rows.info?.affectedRows || 'Check DB manual'}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Heal failed:', err);
    process.exit(1);
  }
}

heal();
