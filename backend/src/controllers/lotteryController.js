const { query } = require('../config/db');
const { randomUUID } = require('crypto');
const { importParticipants } = require('../services/lotteryImportService');

const lotteryController = {
  // CAMPAIGNS
  listCampaigns: async (req, res) => {
    try {
      const companyId = req.user.role === 'superadmin' ? null : req.user.company_id;
      let sql = 'SELECT * FROM lottery_campaigns';
      let params = [];
      
      if (companyId) {
        sql += ' WHERE company_id = ?';
        params.push(companyId);
      }
      
      sql += ' ORDER BY created_at DESC';
      const result = await query(sql, params);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createCampaign: async (req, res) => {
    try {
      const { name, description, price_per_token, total_tokens, start_date, end_date, draw_date, prize_description, prize_value } = req.body;
      const id = randomUUID();
      await query(
        `INSERT INTO lottery_campaigns 
        (id, company_id, name, description, price_per_token, total_tokens, campaign_start_date, campaign_end_date, draw_date, prize_description, prize_value, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, req.user.company_id, name, description, price_per_token || 1100.00, total_tokens || 100000, start_date, end_date, draw_date, prize_description, prize_value, req.user.id]
      );
      res.status(201).json({ id, message: 'Campaign created successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getCampaign: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await query('SELECT * FROM lottery_campaigns WHERE id = ?', [id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'Campaign not found' });
      
      // Get stats
      const stats = await query(
        `SELECT 
          COUNT(*) as total_participants,
          SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_count,
          SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) as pending_count,
          SUM(payment_amount) as total_revenue
        FROM lottery_participants WHERE campaign_id = ?`,
        [id]
      );
      
      res.json({ ...result.rows[0], stats: stats.rows[0] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PARTICIPANTS
  listParticipants: async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 50, search = '', status = '' } = req.query;
      const offset = (page - 1) * limit;
      
      let sql = 'SELECT * FROM lottery_participants WHERE campaign_id = ?';
      let params = [id];
      
      if (search) {
        sql += ' AND (full_name LIKE ? OR phone_number LIKE ? OR token_number LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      
      if (status) {
        sql += ' AND payment_status = ?';
        params.push(status);
      }
      
      sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const result = await query(sql, params);
      const total = await query('SELECT COUNT(*) as count FROM lottery_participants WHERE campaign_id = ?', [id]);
      
      res.json({
        participants: result.rows,
        pagination: {
          total: total.rows[0].count,
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  addParticipant: async (req, res) => {
    try {
      const { id } = req.params; // campaign_id
      const data = req.body;
      const participantId = randomUUID();
      
      // Generate token number if not provided
      const resultCount = await query('SELECT COUNT(*) as count FROM lottery_participants WHERE campaign_id = ?', [id]);
      const token = `ERT-${String(resultCount.rows[0].count + 1).padStart(6, '0')}`;

      await query(
        `INSERT INTO lottery_participants 
        (id, company_id, campaign_id, token_number, full_name, phone_number, aadhar_number, payment_status, payment_method, added_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [participantId, req.user.company_id, id, token, data.full_name, data.phone_number, data.aadhar_number, data.payment_status || 'pending', data.payment_method, req.user.id]
      );
      
      res.status(201).json({ id: participantId, token_number: token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  importExcel: async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
      const { id } = req.params;
      const results = await importParticipants(req.file.path, id, req.user.company_id, req.user.id);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = lotteryController;
