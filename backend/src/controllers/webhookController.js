const { query, transaction } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Handle incoming LEAD pushes from external IVR/Systems using API Keys
 */
exports.handleIvrLead = async (req, res) => {
  const { phone, name, source, notes } = req.body;
  const { companyId } = req; // Provided by apiKeyAuth
  const userId = req.user.id; // API Key owner
  const leadId = uuidv4();

  if (!phone) {
    return res.status(400).json({ error: 'phone number is required' });
  }

  try {
    await transaction(async (connection) => {
      // 1. Check for existing lead to prevent duplicates
      const [existing] = await connection.query(
        'SELECT id FROM leads WHERE phone_number = ? AND company_id = ?',
        [phone, companyId]
      );

      if (existing.length > 0) {
        // Upgrade existing lead if needed, or just log activity
        await connection.query(
          'INSERT INTO activity_logs (id, company_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
          [uuidv4(), companyId, userId, 'External Lead Ping', JSON.stringify({ phone, status: 'Existing Lead Re-Activated' })]
        );
      } else {
        // 2. Create new lead
        await connection.query(
          'INSERT INTO leads (id, company_id, name, phone_number, status, source) VALUES (?, ?, ?, ?, "new", ?)',
          [leadId, companyId, name || 'IVR Lead', phone, source || 'ivr']
        );

        // 3. Log initial activity
        await connection.query(
          'INSERT INTO activity_logs (id, company_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
          [uuidv4(), companyId, userId, 'IVR Lead Ingested', JSON.stringify({ name, source: source || 'ivr' })]
        );

        // 4. Add initial note if provided
        if (notes) {
          await connection.query(
            'INSERT INTO lead_notes (id, lead_id, company_id, note) VALUES (?, ?, ?, ?)',
            [uuidv4(), leadId, companyId, notes]
          );
        }
      }
    });

    res.status(201).json({ 
      success: true, 
      message: 'Strategic lead successfully ingested',
      leadId: leadId
    });

  } catch (err) {
    console.error('[Webhook] IVR Ingestion Error:', err);
    res.status(500).json({ error: 'Strategic ingestion failed' });
  }
};

/**
 * Legacy Exotel Handler (Kept for compatibility)
 */
exports.handleExotelWebhook = async (req, res) => {
  const data = req.body.CallSid ? req.body : req.query;
  const { CallStatus, CallFrom, companyId } = data;

  console.log(`Webhook: Company ${companyId}, Phone ${CallFrom}, Status ${CallStatus}`);

  try {
    const logId = uuidv4();
    await query(
      'INSERT INTO call_logs (id, company_id, phone_number, call_status, direction) VALUES (?, ?, ?, ?, "inbound")',
      [logId, companyId, CallFrom, CallStatus === 'completed' ? 'answered' : 'missed']
    );

    const { rows: leads } = await query(
      'SELECT id FROM leads WHERE company_id = ? AND phone_number = ?',
      [companyId, CallFrom]
    );

    if (leads.length === 0) {
      const leadId = uuidv4();
      await query(
        'INSERT INTO leads (id, company_id, name, phone_number, status, source) VALUES (?, ?, ?, ?, "new", "call")',
        [leadId, companyId, 'Auto-Captured Lead', CallFrom]
      );
    }
    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook Error:', err);
    res.status(500).send('Internal Error');
  }
};
