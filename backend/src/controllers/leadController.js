const { query, transaction } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getLeads = async (req, res) => {
  const { company_id, role, id: user_id } = req.user;
  try {
    let sql = 'SELECT id, name, phone_number, status, source, created_at FROM leads WHERE company_id = ? AND deleted_at IS NULL';
    const params = [company_id];

    if (role === 'employee') {
      sql += ' AND assigned_to = ?';
      params.push(user_id);
    }

    sql += ' ORDER BY created_at DESC';

    const { rows } = await query(sql, params);
    res.json(rows || []);
  } catch (err) {
    console.error('[Leads] Fetch failed:', err.message);
    res.json([]);
  }
};

exports.createLead = async (req, res) => {
  const { company_id, id: user_id } = req.user;
  const { name, phone_number, status, source } = req.body;
  const lead_id = uuidv4();
  
  try {
    await transaction(async (connection) => {
      // 1. Record the lead
      await connection.query(
        'INSERT INTO leads (id, company_id, name, phone_number, status, source, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [lead_id, company_id, name, phone_number, status || 'new', source || 'manual', user_id]
      );

      // 2. Trigger activity log (Check if table exists first via code logic, or assume for now)
      await connection.query(
        'INSERT INTO activity_logs (id, company_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), company_id, user_id, 'Lead Captured', JSON.stringify({ name, source, method: 'Manual Web' })]
      );
    });

    res.status(201).json({ id: lead_id, message: 'Strategic intelligence captured' });
  } catch (err) {
    console.error('[Leads] Capture Forensic Error:', err.message);
    res.status(500).json({ message: 'Strategic capture failed: ' + err.message });
  }
};

exports.getLeadById = async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user;
  try {
    const { rows } = await query(
      'SELECT * FROM leads WHERE id = ? AND company_id = ?',
      [id, company_id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Lead not found' });
    
    const lead = rows[0];

    const { rows: notes } = await query(
      'SELECT id, note as content, created_at FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC',
      [id]
    );

    res.json({ ...lead, notes_log: notes });
  } catch (err) {
    console.error('[Leads] Get Details Failed:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateLeadStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { company_id, id: user_id } = req.user;
  try {
    await transaction(async (connection) => {
      await connection.query(
        'UPDATE leads SET status = ? WHERE id = ? AND company_id = ?',
        [status, id, company_id]
      );

      await connection.query(
        'INSERT INTO activity_logs (id, company_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), company_id, user_id, 'Status Shifted', JSON.stringify({ lead_id: id, new_status: status })]
      );
    });

    res.json({ message: 'Lead progression updated' });
  } catch (err) {
    console.error('[Leads] Status Update Failed:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteLead = async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user;
  try {
    await query('UPDATE leads SET deleted_at = NOW() WHERE id = ? AND company_id = ?', [id, company_id]);
    res.json({ message: 'Lead moved to trash' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addNote = async (req, res) => {
  const { id: lead_id } = req.params;
  const { content } = req.body;
  const { company_id, id: user_id } = req.user;
  const note_id = uuidv4();
  
  try {
    const { rows } = await query('SELECT status FROM leads WHERE id = ? AND company_id = ?', [lead_id, company_id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Access denied' });

    await transaction(async (connection) => {
      await connection.query(
        'INSERT INTO lead_notes (id, lead_id, company_id, note) VALUES (?, ?, ?, ?)',
        [note_id, lead_id, company_id, content]
      );

      await connection.query(
        'INSERT INTO activity_logs (id, company_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), company_id, user_id, 'Note Appended', JSON.stringify({ lead_id, note_id })]
      );
    });

    res.status(201).json({ id: note_id, message: 'Intelligence log updated' });
  } catch (err) {
    console.error('[Leads] Add Note Failed:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
