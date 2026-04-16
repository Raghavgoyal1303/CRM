const { query } = require('../config/db');

async function upgrade() {
  console.log('--- Starting Robust Properties Table Upgrade ---');
  try {
    // 1. Manually check if columns exist by describing the table
    const { rows: columns } = await query('DESCRIBE properties');
    const existingColumns = columns.map(c => c.Field);

    if (!existingColumns.includes('visibility')) {
      console.log('Adding visibility column...');
      await query("ALTER TABLE properties ADD COLUMN visibility ENUM('public', 'private') DEFAULT 'public'");
    } else {
      console.log('visibility column already exists.');
    }

    if (!existingColumns.includes('created_by_id')) {
      console.log('Adding created_by_id column...');
      await query("ALTER TABLE properties ADD COLUMN created_by_id VARCHAR(36) AFTER company_id");
    } else {
      console.log('created_by_id column already exists.');
    }

    // Always ensure price is DECIMAL for precision
    await query(`ALTER TABLE properties MODIFY COLUMN price DECIMAL(15,2) DEFAULT 0`);

    // Clean up any nulls if they were somehow created
    await query(`UPDATE properties SET visibility = 'public' WHERE visibility IS NULL`);

    console.log('✅ Upgrade Successful!');
  } catch (err) {
    console.error('❌ Upgrade Failed:', err.message);
  } finally {
    process.exit(0);
  }
}

upgrade();
