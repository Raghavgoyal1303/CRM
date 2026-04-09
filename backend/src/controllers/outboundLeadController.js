const db = require('../config/db');
const { randomUUID } = require('crypto');

exports.getOutboundLeads = async (req, res) => {
  const { company_id } = req.user;
  try {
    const { rows } = await db.query(
      `SELECT ol.*, oc.name as campaign_name 
       FROM outbound_leads ol
       LEFT JOIN outbound_campaigns oc ON ol.campaign_id = oc.id
       WHERE ol.company_id = ? 
       ORDER BY ol.created_at DESC`,
      [company_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateOutboundLead = async (req, res) => {
  const { id } = req.params;
  const { status, notes, budget, project_location } = req.body;
  const { company_id } = req.user;
  try {
    await db.query(
      'UPDATE outbound_leads SET status = ?, notes = ?, budget = ?, project_location = ? WHERE id = ? AND company_id = ?',
      [status, notes, budget, project_location, id, company_id]
    );
    res.json({ success: true, message: 'Prospect profile updated' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.convertToLead = async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user;
  try {
    const { rows } = await db.query(
      'SELECT * FROM outbound_leads WHERE id = ? AND company_id = ?',
      [id, company_id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Prospect not found' });
    
    const prospect = rows[0];
    const leadId = randomUUID();
    
    await db.query(
      'INSERT INTO leads (id, company_id, name, phone_number, status, source) VALUES (?, ?, ?, ?, "new", "campaign")',
      [leadId, company_id, prospect.name, prospect.phone_number]
    );
    
    await db.query(
      'UPDATE outbound_leads SET converted_to_lead = 1, status = "converted" WHERE id = ?',
      [id]
    );
    
    res.json({ success: true, lead_id: leadId, message: 'Prospect elevated to primary lead' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.setReminder = async (req, res) => {
  const { id } = req.params;
  const { reminder_date } = req.body;
  const { company_id } = req.user;
  try {
    await db.query(
      'UPDATE outbound_leads SET site_visit_date = ?, status = "reminder_set" WHERE id = ? AND company_id = ?',
      [reminder_date, id, company_id]
    );
    res.json({ success: true, message: 'Engagement reminder scheduled' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
