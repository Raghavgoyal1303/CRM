const db = require('../src/config/db');
const fs = require('fs');
const path = require('path');

const migrate = async () => {
  const sqlFile = path.join(__dirname, '..', '..', 'database', 'communications_migration.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  // Split by semicolon, but handle procedures/triggers if they existed (not here)
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`🚀 Starting migration: ${statements.length} statements found.`);

  for (let i = 0; i < statements.length; i++) {
    try {
      await db.query(statements[i]);
      console.log(`✅ Executed (${i + 1}/${statements.length})`);
    } catch (err) {
      // If table/column already exists, log as warning instead of error
      if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_FIELDNAME') {
        console.warn(`⚠️ Warning: ${err.message}`);
      } else {
        console.error(`❌ Error in statement: ${statements[i]}`);
        console.error(err);
        // Do not exit, try next statement to handle incremental updates
      }
    }
  }

  console.log('🏁 Migration process finished.');
  process.exit(0);
};

migrate();
