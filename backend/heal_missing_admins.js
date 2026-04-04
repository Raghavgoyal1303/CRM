require('dotenv').config();
const db = require('./src/config/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function heal() {
  try {
    console.log('--- STARTING HEAL: MISSING ADMINS ---');
    
    // 1. Find companies without any employees associated
    const [companies] = await db.pool.execute(`
      SELECT c.id, c.name, c.email, c.owner_name, c.phone 
      FROM companies c
      LEFT JOIN employees e ON c.id = e.company_id
      WHERE e.id IS NULL
    `);

    console.log(`Found ${companies.length} orphaned companies.`);

    const defaultPasswordHash = await bcrypt.hash('admin123', 12);

    for (const comp of companies) {
      const adminId = uuidv4();
      console.log(`Healing: ${comp.name} (${comp.email})`);
      
      try {
        await db.pool.execute(
          'INSERT INTO employees (id, company_id, name, email, phone_number, password_hash, role, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW())',
          [adminId, comp.id, comp.owner_name || 'Admin', comp.email, comp.phone, defaultPasswordHash, 'admin']
        );
        console.log(`✅ Fixed: ${comp.name}`);
      } catch (err) {
        console.error(`❌ Failed to fix ${comp.name}:`, err.message);
      }
    }

    console.log('--- HEAL COMPLETE ---');
    process.exit(0);
  } catch (err) {
    console.error('❌ Critical Heal failure:', err);
    process.exit(1);
  }
}

heal();
