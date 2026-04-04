const db = require('../config/db');

/**
 * Trigger Auto-Response Sequence
 * @param {string} companyId 
 * @param {string} phone 
 * @param {string} leadId 
 */
exports.triggerAutoResponse = async (companyId, phone, leadId) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM auto_response_settings WHERE company_id = ?',
      [companyId]
    );
    if (rows.length === 0) return;
    const s = rows[0];

    // Step 1: SMS
    if (s.sms_enabled) {
      const delay = (s.sms_delay_minutes || 0) * 60 * 1000;
      setTimeout(async () => {
        try {
          console.log(`[Auto-Response] Sending SMS to ${phone} for company ${companyId}`);
          // Actual MSG91 API call would go here
          // await msg91.send(phone, s.sms_template);
          
          await db.query(
            'INSERT INTO communication_logs (id, company_id, lead_id, phone_number, channel, message_text, status, triggered_by) VALUES (UUID(), ?, ?, ?, "sms", ?, "sent", "missed_call")',
            [companyId, leadId, phone, s.sms_template]
          );
          await db.query('UPDATE leads SET sms_sent = 1 WHERE id = ?', [leadId]);
        } catch (err) {
          console.error('[Auto-Response] SMS failed:', err.message);
        }
      }, delay);
    }

    // Step 2: WhatsApp Sequential Follow-up
    if (s.whatsapp_followup_enabled) {
      const waDelay = (s.whatsapp_followup_hours || 0) * 60 * 60 * 1000;
      setTimeout(async () => {
        try {
          // Check if user replied to SMS first (mock check)
          const { rows: logs } = await db.query(
            'SELECT id FROM communication_logs WHERE lead_id = ? AND direction = "inbound" AND channel = "sms"',
            [leadId]
          );
          
          if (logs.length === 0) {
            console.log(`[Auto-Response] Sending WhatsApp Follow-up to ${phone}`);
            // Actual WhatsApp API call would go here
            
            await db.query(
              'INSERT INTO communication_logs (id, company_id, lead_id, phone_number, channel, message_text, status, triggered_by) VALUES (UUID(), ?, ?, ?, "whatsapp", ?, "sent", "no_sms_reply")',
              [companyId, leadId, phone, s.whatsapp_template]
            );
            await db.query('UPDATE leads SET wa_sent = 1 WHERE id = ?', [leadId]);
          }
        } catch (err) {
          console.error('[Auto-Response] WhatsApp failed:', err.message);
        }
      }, waDelay);
    }
  } catch (err) {
    console.error('[Auto-Response] Service error:', err.message);
  }
};
