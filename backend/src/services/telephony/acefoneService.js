const axios = require('axios');

/**
 * Acefone Telephony Service (India Region)
 */
class AcefoneService {
  /**
   * Triggers a Click-to-Call sequence via Acefone.in
   * @param {Object} params 
   * @param {string} params.apiKey - Acefone API Token
   * @param {string} params.agentExt - The agent's extension or EID
   * @param {string} params.customerPhone - The destination phone number
   * @param {string} [params.callerId] - The DID to show the customer
   * @returns {Promise<Object>}
   */
  async initiateCall({ apiKey, agentExt, customerPhone, callerId }) {
    try {
      if (!apiKey || !agentExt || !customerPhone) {
        throw new Error('Acefone configuration missing (API Key, Extension, or Phone)');
      }

      console.log(`[Acefone] Initiating call: Agent ${agentExt} -> Customer ${customerPhone}`);

      const response = await axios.post('https://api.acefone.in/v1/click_to_call', {
        agent_number: agentExt,
        destination_number: customerPhone,
        caller_id: callerId || '',
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[Acefone] API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Helper to parse Acefone's webhook payload into CRM standard format
   * @param {Object} payload 
   */
  formatWebhookData(payload) {
    return {
      callSid: payload.call_id || payload.id,
      phone: payload.caller_id || payload.source,
      destination: payload.destination,
      duration: parseInt(payload.duration || 0),
      recordingUrl: payload.recording_url,
      status: payload.status === 'answered' ? 'answered' : 'missed',
      direction: payload.direction || 'inbound',
      timestamp: payload.start_time || new Date().toISOString()
    };
  }
}

module.exports = new AcefoneService();
