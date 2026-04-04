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
  console.log('🚀 High-Precision Premium CRM Seeding...');
  try {
    const [allEmployees] = await pool.execute('SELECT id, company_id FROM employees LIMIT 1');
    if (allEmployees.length === 0) {
      console.error('❌ CRITICAL: No employees found.');
      process.exit(1);
    }
    
    const staffId = allEmployees[0].id;
    const companyId = allEmployees[0].company_id;
    
    console.log(`📡 Context -> Company: ${companyId} | Staff: ${staffId}`);

    const leadNames = [
      'John Smith', 'Sarah Jenkins', 'Michael Ross', 'Rachel Zane', 'Harvey Specter',
      'Louis Litt', 'Donna Paulsen', 'Jessica Pearson', 'Robert Zane', 'Katrina Bennett'
    ];
    
    const statuses = ['new', 'interested', 'site_visit', 'closed', 'lost'];
    const sources = ['Google Ads', 'Facebook', 'LinkedIn', 'Referral', 'Organic'];

    for (let name of leadNames) {
      const id = uuidv4();
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;

      // INSERT LEAD
      try {
        await pool.execute(
          'INSERT INTO leads (id, company_id, name, phone_number, status, source, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [id, companyId, name, phone, status, source, staffId]
        );
        console.log(`✅ Lead Created: ${name}`);
      } catch (e) {
        console.error(`❌ Lead Failed (${name}):`, e.message);
        continue;
      }

      // INSERT ACTIVITY
      try {
        await pool.execute(
          'INSERT INTO activity_logs (id, company_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
          [uuidv4(), companyId, staffId, 'Lead Captured', JSON.stringify({ name, source, status })]
        );
        console.log(`✅ Activity Logged: ${name}`);
      } catch (e) {
        console.error(`❌ Activity Failed (${name}):`, e.message);
      }

      // INSERT FOLLOW-UP
      try {
        if (Math.random() > 0.25) {
          const date = new Date();
          date.setHours(date.getHours() + Math.floor(Math.random() * 48));
          await pool.execute(
            'INSERT INTO follow_ups (id, company_id, lead_id, employee_id, next_followup_date, note, is_done) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uuidv4(), companyId, id, staffId, date, `Follow up with ${name}.`, 0]
          );
          console.log(`✅ Task Scheduled: ${name}`);
        }
      } catch (e) {
        console.error(`❌ Task Failed (${name}):`, e.message);
      }
    }

    console.log('✅ SEEDING COMPLETE!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Master Seeding Failed:', error.message);
    process.exit(1);
  }
}
seed();
