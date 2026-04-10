const db = require('../config/db');
const { randomUUID } = require('crypto');

exports.getSettings = async (req, res) => {
  const { company_id } = req.user;
  try {
    const { rows } = await db.query(
      'SELECT * FROM auto_response_settings WHERE company_id = ?',
      [company_id]
    );

    if (rows.length === 0) {
      return res.json({
        sms_enabled: false,
        whatsapp_enabled: false,
        sms_template: 'Thank you for calling. We missed your call and will get back to you shortly.',
        whatsapp_template: 'Hi! We noticed a missed call from you. How can we help you today?'
      });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateSettings = async (req, res) => {
  const { company_id } = req.user;
  const { sms_enabled, whatsapp_enabled, sms_template, whatsapp_template } = req.body;
  try {
    // Tricity Verified logic: Upsert the company's auto-response configuration
    const { rows } = await db.query(
      'SELECT id FROM auto_response_settings WHERE company_id = ?',
      [company_id]
    );

    if (rows.length > 0) {
      await db.query(
        'UPDATE auto_response_settings SET sms_enabled = ?, whatsapp_enabled = ?, sms_template = ?, whatsapp_template = ? WHERE company_id = ?',
        [sms_enabled, whatsapp_enabled, sms_template, whatsapp_template, company_id]
      );
    } else {
      const id = randomUUID();
      await db.query(
        'INSERT INTO auto_response_settings (id, company_id, sms_enabled, whatsapp_enabled, sms_template, whatsapp_template) VALUES (?, ?, ?, ?, ?, ?)',
        [id, company_id, sms_enabled, whatsapp_enabled, sms_template, whatsapp_template]
      );
    }
    res.json({ message: 'Communication strategy updated' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

