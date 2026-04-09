const { query, transaction } = require('../config/db');
const { randomUUID } = require('crypto');

/**
 * List all campaigns for company
 */
exports.getCampaigns = async (req, res) => {
  const { company_id } = req.user;
  try {
    const { rows } = await query(
      'SELECT * FROM outbound_campaigns WHERE company_id = ? ORDER BY created_at DESC',
      [company_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('getCampaigns error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Create new campaign
 */
exports.createCampaign = async (req, res) => {
  const { company_id, id: userId } = req.user;
  const { name, description, daily_limit } = req.body;
  const id = randomUUID();
  try {
    await query(
      'INSERT INTO outbound_campaigns (id, company_id, name, description, daily_limit, status, created_by) VALUES (?, ?, ?, ?, ?, "draft", ?)',
      [id, company_id, name, description, daily_limit || 1000, userId]
    );
    res.status(201).json({ id, name, status: 'draft' });
  } catch (err) {
    console.error('createCampaign error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Campaign details + stats
 */
exports.getCampaignById = async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user;
  try {
    const { rows } = await query(
      'SELECT * FROM outbound_campaigns WHERE id = ? AND company_id = ?',
      [id, company_id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Campaign not found' });
    
    const { rows: stats } = await query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN last_call_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN last_call_status = 'answered' THEN 1 ELSE 0 END) as answered,
        SUM(CASE WHEN last_call_status = 'interested' THEN 1 ELSE 0 END) as interested,
        SUM(CASE WHEN last_call_status = 'not_interested' THEN 1 ELSE 0 END) as not_interested
       FROM outbound_numbers WHERE campaign_id = ?`,
      [id]
    );

    res.json({ ...rows[0], stats: stats[0] });
  } catch (err) {
    console.error('getCampaignById error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Update campaign status (LAUNCH)
 */
exports.updateCampaignStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { company_id, id: user_id } = req.user;
  try {
    await transaction(async (connection) => {
      // 1. Update status
      const updateStartedAt = status === 'running' ? ', started_at = IFNULL(started_at, NOW())' : '';
      await connection.query(
        `UPDATE outbound_campaigns SET status = ?${updateStartedAt} WHERE id = ? AND company_id = ?`,
        [status, id, company_id]
      );

      // 2. Log activity
      await connection.query(
        'INSERT INTO activity_logs (id, company_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [randomUUID(), company_id, user_id, 'Campaign Status Shift', JSON.stringify({ campaign_id: id, new_status: status })]
      );
    });

    res.json({ success: true, status });
  } catch (err) {
    console.error('updateCampaignStatus error:', err);
    res.status(500).json({ message: 'Internal Server Error: ' + err.message });
  }
};

/**
 * Upload CSV/Excel numbers
 */
exports.uploadCampaignNumbers = async (req, res) => {
  const { id: campaign_id } = req.params;
  const { company_id } = req.user;
  const { numbers } = req.body;

  if (!Array.isArray(numbers)) return res.status(400).json({ message: 'Invalid format' });

  try {
    await transaction(async (connection) => {
        for (const entry of numbers) {
          const id = randomUUID();
          await connection.query(
            'INSERT INTO outbound_numbers (id, company_id, campaign_id, phone_number, last_call_status) VALUES (?, ?, ?, ?, "pending")',
            [id, company_id, campaign_id, entry.phone]
          );
        }
        
        await connection.query(
          'UPDATE outbound_campaigns SET total_numbers = (SELECT COUNT(*) FROM outbound_numbers WHERE campaign_id = ?) WHERE id = ?',
          [campaign_id, campaign_id]
        );
    });

    res.json({ success: true, count: numbers.length });
  } catch (err) {
    console.error('uploadCampaignNumbers error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
