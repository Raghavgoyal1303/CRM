const { query, transaction } = require('../config/db');
const acefoneService = require('../services/telephony/acefoneService');
const { assignRoundRobin } = require('../services/assignmentService');
const { v4: uuidv4 } = require('uuid');

/**
 * Handle Telephony Logic (Click-to-Call + Webhooks)
 */
exports.handleAcefoneCall = async (req, res) => {
  const { leadId } = req.body;
  const { company_id, id: employeeId } = req.user;

  try {
    // 1. Get Employee's Acefone Extension and Company's API Key
    const [emp] = await query('SELECT acefone_extension FROM employees WHERE id = ?', [employeeId]);
    const [company] = await query('SELECT acefone_api_key FROM companies WHERE id = ?', [company_id]);
    const [lead] = await query('SELECT phone_number FROM leads WHERE id = ? AND company_id = ?', [leadId, company_id]);

    if (!emp[0]?.acefone_extension) return res.status(400).json({ message: 'Acefone Extension not configured for this user' });
    if (!company[0]?.acefone_api_key) return res.status(400).json({ message: 'Acefone API Key not configured for this company' });
    if (!lead[0]) return res.status(404).json({ message: 'Lead not found' });

    // 2. Trigger Dial
    const result = await acefoneService.initiateCall({
      apiKey: company[0].acefone_api_key,
      agentExt: emp[0].acefone_extension,
      customerPhone: lead[0].phone_number
    });

    if (result.success) {
      res.json({ message: 'Call initiated. Please check your Acefone handset/softphone.' });
    } else {
      res.status(500).json({ message: 'Acefone Dialing Failed', error: result.error });
    }
  } catch (error) {
    console.error('[Acefone] Click-to-Call Controller Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Webhook Handler: Captures Inbound calls, assigns leads, and logs results
 */
exports.handleAcefoneWebhook = async (req, res) => {
  const { companyId } = req.params;
  const rawPayload = req.body;
  
  console.log(`[Acefone Webhook] Received event for Company ${companyId}:`, JSON.stringify(rawPayload));

  const data = acefoneService.formatWebhookData(rawPayload);

  try {
    await transaction(async (connection) => {
      // 1. Check if it's an Inbound Call starting
      // Note: Acefone events vary. We'll check for lead capture on 'new' calls.
      const phone = data.phone;

      // 2. Check for existing lead
      const [existing] = await connection.query(
        'SELECT id, assigned_to FROM leads WHERE phone_number = ? AND company_id = ?', 
        [phone, companyId]
      );

      let targetLeadId;
      if (existing.length === 0) {
        // Create new lead with Round Robin assignment
        const assignedEmployeeId = await assignRoundRobin(companyId);
        targetLeadId = uuidv4();
        
        await connection.query(
          'INSERT INTO leads (id, company_id, phone_number, name, status, source, assigned_to) VALUES (?, ?, ?, ?, "new", "call", ?)',
          [targetLeadId, companyId, phone, 'Inbound Call Lead', assignedEmployeeId]
        );

        // 3. Log specialized activity if unassigned
        if (!assignedEmployeeId) {
          await connection.query(
            'INSERT INTO activity_logs (id, company_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
            [uuidv4(), companyId, null, 'Inbound Lead (No Agents Online)', JSON.stringify({ phone, info: 'Lead created but no authorized agents were clocked-in.' })]
          );
        }
        
        console.log(`[Acefone Webhook] Lead ${targetLeadId}: Assigned=${assignedEmployeeId || 'NONE'}`);
      } else {
        targetLeadId = existing[0].id;
      }

      // 3. Log the call if it's finished (duration > 0 or status received)
      if (data.callSid && (data.duration > 0 || data.recordingUrl)) {
        await connection.query(
          'INSERT INTO call_logs (id, company_id, lead_id, call_status, duration, recording_url) VALUES (?, ?, ?, ?, ?, ?)',
          [uuidv4(), companyId, targetLeadId, data.status, data.duration, data.recordingUrl]
        );
      }
    });

    res.status(200).send('Webhook Received');
  } catch (error) {
    console.error('[Acefone Webhook] Error:', error);
    res.status(500).send('Internal Server Error');
  }
};
