const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'leadflow_db',
});

async function seed() {
  console.log('🚀 Final Seeding Rescue for Raghav Goyal (LeadFlow HQ)...');
  try {
    // 1. Force the correct IDs we verified
    const companyId = 'hq_company_001';
    const staffId = 'owner_001';
    
    console.log(`📡 Correct Context -> Company: ${companyId} | Staff: ${staffId}`);

    const leadNames = [
      'John Smith', 'Sarah Jenkins', 'Michael Ross', 'Rachel Zane', 'Harvey Specter',
      'Louis Litt', 'Donna Paulsen', 'Jessica Pearson', 'Robert Zane', 'Katrina Bennett',
      'Alex Williams', 'Samantha Wheeler', 'Jeff Malone', 'Sean Cahill', 'Travis Tanner',
      'Scottie Scott', 'Anita Gibbs', 'Andrew Malik', 'Cameron Dennis', 'Daniel Hardman'
    ];
    
    const statuses = ['new', 'interested', 'site_visit', 'closed', 'lost'];
    const sources = ['Google Ads', 'Facebook', 'LinkedIn', 'Referral', 'Organic'];

    console.log(`📝 Creating ${leadNames.length} premium leads...`);
    for (let name of leadNames) {
      const id = uuidv4();
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;

      // INSERT LEAD
      await pool.execute(
        'INSERT INTO leads (id, company_id, name, phone_number, status, source, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, companyId, name, phone, status, source, staffId]
      );

      // INSERT ACTIVITY
      await pool.execute(
        'INSERT INTO activity_logs (id, company_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), companyId, staffId, 'Lead Captured', JSON.stringify({ name, source, status })]
      );

      // INSERT FOLLOW-UP
      if (Math.random() > 0.25) {
        const date = new Date();
        date.setHours(date.getHours() + Math.floor(Math.random() * 48));
        await pool.execute(
          'INSERT INTO follow_ups (id, company_id, lead_id, employee_id, next_followup_date, note, is_done) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [uuidv4(), companyId, id, staffId, date, `Follow up with ${name}.`, 0]
        );
      }
    }

    console.log('✅ SEEDING COMPLETE! Refresh Website & Mobile now.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error.message);
    process.exit(1);
  }
}
seed();
