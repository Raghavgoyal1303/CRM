const { pool } = require('./src/config/db');

async function seedData() {
  const connection = await pool.getConnection();
  try {
    // 1. Ensure Companies exist
    const companies = [
      ['comp-0001-0000-0000-000000000001', 'Elite Realty', 'Raghav Goyal', 'owner@eliterealty.com', 'active'],
      ['comp-0002-0000-0000-000000000002', 'Alpha Builders', 'John Doe', 'john@alphabuilders.com', 'active'],
      ['comp-0003-0000-0000-000000000003', 'Gamma Group', 'Jane Smith', 'jane@gammagroup.com', 'suspended']
    ];

    for (let [id, name, owner, email, status] of companies) {
      await connection.query(
        'INSERT INTO companies (id, name, owner_name, email, subscription_status) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name)',
        [id, name, owner, email, status]
      );
    }

    // 2. Ensure Employees exist
    const employees = [
      ['emp-e001-0000-0000-000000000001', 'comp-0001-0000-0000-000000000001', 'Elite Admin', 'admin@eliterealty.com', 'admin'],
      ['emp-e002-0000-0000-000000000002', 'comp-0001-0000-0000-000000000001', 'Priya Singh', 'priya@eliterealty.com', 'employee'],
      ['emp-e003-0000-0000-000000000003', 'comp-0001-0000-0000-000000000001', 'Vikram Shah', 'vikram@eliterealty.com', 'employee'],
      ['emp-e004-0000-0000-000000000004', 'comp-0001-0000-0000-000000000001', 'Sneha Patel', 'sneha@eliterealty.com', 'employee'],
      ['emp-a001-0000-0000-000000000001', 'comp-0002-0000-0000-000000000002', 'Alpha Admin', 'admin@alphabuilders.com', 'admin'],
      ['emp-super-0000-0000-000000000001', null, 'Super Admin', 'super@Tricity Verified.com', 'superadmin']
    ];

    for (let [id, cid, name, email, role] of employees) {
      await connection.query(
        'INSERT INTO employees (id, company_id, name, email, role, password_hash) VALUES (?, ?, ?, ?, ?, "---") ON DUPLICATE KEY UPDATE name=VALUES(name)',
        [id, cid, name, email, role]
      );
    }

    // 3. Lottery Campaign
    await connection.query(`
      INSERT INTO lottery_campaigns (
        id, company_id, name, description,
        price_per_token, total_tokens, tokens_sold,
        campaign_start_date, campaign_end_date, draw_date,
        prize_description, prize_value, winners_count,
        refund_amount, status, created_by
      ) VALUES (
        'lott-0001-0000-0000-000000000001',
        'comp-0001-0000-0000-000000000001',
        'Elite Realty Lucky Plot Scheme 2026',
        'Buy a token at Rs.1100 and win a plot worth 10 lakhs. 100 winners will be selected by lucky draw in March 2027. All non-winners receive full refund of Rs.1100.',
        1100.00, 100000, 247,
        '2026-03-01', '2027-03-01', '2027-03-15',
        '100 plots worth Rs.10 Lakhs each in Elite Realty Township, Sector 45, Noida',
        1000000.00, 100,
        1100.00, 'active',
        'emp-e001-0000-0000-000000000001'
      ) ON DUPLICATE KEY UPDATE name=VALUES(name)
    `);

    // 4. API Keys
    const apiKeys = [
      ['Website Contact Form', 'lf_live_elite_website_key_2026_abc123xyz', 'lf_live_a8f3...xy9z', '{"leads":["write"],"call_logs":["write"]}', 'live'],
      ['Reporting Dashboard', 'lf_live_elite_reporting_key_2026_def456uvw', 'lf_live_b9g4...uv8w', '{"leads":["read"],"analytics":["read"],"employees":["read"]}', 'live'],
      ['Test Key', 'lf_test_elite_test_key_2026_ghi789rst', 'lf_test_c1h5...rs7t', '{"leads":["read","write"],"analytics":["read"]}', 'test']
    ];

    for (let [name, rawKey, preview, perms, env] of apiKeys) {
      const crypto = require('crypto');
      const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
      await connection.query(
        'INSERT INTO api_keys (id, company_id, name, key_hash, key_preview, permissions, environment, created_by) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)',
        ['comp-0001-0000-0000-000000000001', name, hash, preview, perms, env, 'emp-e001-0000-0000-000000000001']
      );
    }

    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    connection.release();
    process.exit();
  }
}

seedData();

