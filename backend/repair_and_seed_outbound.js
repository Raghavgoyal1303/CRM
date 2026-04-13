const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function repairAndSeed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Raghav@1333',
    database: process.env.DB_NAME || 'leadflow_db',
  });

  console.log('Connected to database.');

  try {
    // 1. Create Table
    console.log('Ensuring outbound_leads table exists...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS outbound_leads (
        id CHAR(36) PRIMARY KEY,
        company_id CHAR(36) NOT NULL,
        campaign_id CHAR(36),
        name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        status ENUM('raw', 'contacted', 'interested', 'reminder_set', 'converted', 'rejected') DEFAULT 'raw',
        notes TEXT,
        budget VARCHAR(50),
        project_location VARCHAR(255),
        converted_to_lead BOOLEAN DEFAULT FALSE,
        site_visit_date DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (campaign_id) REFERENCES outbound_campaigns(id) ON DELETE SET NULL
      )
    `);

    // 2. Fetch dependencies
    const [companies] = await connection.query('SELECT id FROM companies LIMIT 1');
    const [campaigns] = await connection.query('SELECT id FROM outbound_campaigns LIMIT 1');
    
    if (companies.length === 0) {
      console.log('No companies found. Skipping seed.');
      return;
    }

    const companyId = companies[0].id;
    const campaignId = campaigns.length > 0 ? campaigns[0].id : null;

    // 3. Seed Sample Data
    console.log('Seeding sample outbound leads...');
    const samples = [
        { name: 'Amit Kumar', phone: '9876543210', location: 'Zirakpur', budget: '50-60L' },
        { name: 'Sonia Sharma', phone: '9876543211', location: 'Mohali Phase 7', budget: '1.2Cr' },
        { name: 'Rajesh Gupta', phone: '9876543212', location: 'Panchkula Sec 20', budget: '80L' },
        { name: 'Deepak Verma', phone: '9876543213', location: 'Chandigarh Sec 34', budget: '2Cr+' },
        { name: 'Anjali Negi', phone: '9876543214', location: 'Dera Bassi', budget: '35L' },
        { name: 'Vikram Singh', phone: '9876543215', location: 'New Chandigarh', budget: '95L' },
        { name: 'Mehak Preet', phone: '9876543216', location: 'Kharar', budget: '45-55L' },
        { name: 'Suresh Raina', phone: '9876543217', location: 'Sec 15, Chd', budget: '1.5Cr' },
        { name: 'Pooja Rani', phone: '9876543218', location: 'Sec 44, Chd', budget: '70L' },
        { name: 'Karan Mehra', phone: '9876543219', location: 'Peer Muchalla', budget: '40L' }
    ];

    for (const s of samples) {
        await connection.query(
            'INSERT INTO outbound_leads (id, company_id, campaign_id, name, phone_number, status, project_location, budget) VALUES (?, ?, ?, ?, ?, "raw", ?, ?)',
            [uuidv4(), companyId, campaignId, s.name, s.phone, s.location, s.budget]
        );
    }

    console.log(`Successfully seeded ${samples.length} outbound leads.`);
  } catch (err) {
    console.error('Error during repair and seed:', err);
  } finally {
    await connection.end();
  }
}

repairAndSeed();
