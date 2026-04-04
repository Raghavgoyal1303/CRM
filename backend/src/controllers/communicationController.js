const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getCommunications = async (req, res) => {
  const { company_id } = req.user;
  try {
    const { rows } = await db.query(
      'SELECT id, phone_number, channel, message_text, status, triggered_by, sent_at FROM communication_logs WHERE company_id = ? ORDER BY sent_at DESC',
      [company_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getLeadCommunications = async (req, res) => {
  const { leadId } = req.params;
  const { company_id } = req.user;
  try {
    const { rows } = await db.query(
      'SELECT * FROM communication_logs WHERE lead_id = ? AND company_id = ? ORDER BY sent_at DESC',
      [leadId, company_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.sendManualSMS = async (req, res) => {
  const { company_id } = req.user;
  const { phone_number, message_text, lead_id } = req.body;
  const id = uuidv4();
  try {
    // LeadFlow logic: Log the dispatch first
    await db.query(
      'INSERT INTO communication_logs (id, company_id, lead_id, phone_number, channel, message_text, status, triggered_by) VALUES (?, ?, ?, ?, "sms", ?, "sent", "manual")',
      [id, company_id, lead_id, phone_number, message_text]
    );
    res.status(201).json({ id, message: 'SMS dispatch record captured' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.sendManualWhatsApp = async (req, res) => {
  const { company_id } = req.user;
  const { phone_number, message_text, lead_id, brochure_url } = req.body;
  const id = uuidv4();
  try {
    // WhatsApp lead logic: Log with brochure support
    await db.query(
      'INSERT INTO communication_logs (id, company_id, lead_id, phone_number, channel, message_text, status, triggered_by) VALUES (?, ?, ?, ?, "whatsapp", ?, "sent", "manual")',
      [id, company_id, lead_id, phone_number, message_text]
    );
    res.status(201).json({ id, message: 'WhatsApp dispatch record captured' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
