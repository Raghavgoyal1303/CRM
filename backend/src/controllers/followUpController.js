const db = require('../config/db');
const { randomUUID } = require('crypto');

exports.getFollowUps = async (req, res) => {
  const { company_id, role, id: user_id } = req.user;
  try {
    let sql = `
      SELECT f.*, l.name as lead_name, l.phone_number 
      FROM follow_ups f 
      JOIN leads l ON f.lead_id = l.id 
      WHERE f.company_id = ?
    `;
    const params = [company_id];

    if (role === 'employee') {
      sql += ' AND l.assigned_to = ?';
      params.push(user_id);
    }

    sql += ' ORDER BY f.next_followup_date ASC';

    const { rows } = await db.query(sql, params);
    res.json(rows || []);
  } catch (err) {
    console.error('[FollowUps] Query failed:', err.message);
    res.json([]);
  }
};

exports.createFollowUp = async (req, res) => {
  const { company_id } = req.user;
  const { lead_id, follow_up_date, notes } = req.body;
  const id = randomUUID();
  try {
    await db.query(
      'INSERT INTO follow_ups (id, company_id, lead_id, follow_up_date, notes, status) VALUES (?, ?, ?, ?, ?, "pending")',
      [id, company_id, lead_id, follow_up_date, notes]
    );
    res.status(201).json({ id, message: 'Follow-up scheduled' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateFollowUpStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { company_id } = req.user;
  try {
    await db.query(
      'UPDATE follow_ups SET status = ? WHERE id = ? AND company_id = ?',
      [status, id, company_id]
    );
    res.json({ message: 'Follow-up updated' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteFollowUp = async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user;
  try {
    await db.query('DELETE FROM follow_ups WHERE id = ? AND company_id = ?', [id, company_id]);
    res.json({ message: 'Follow-up cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
