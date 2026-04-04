const db = require('../config/db');

/**
 * Daily Campaign Setup
 * Logic to reset counters at midnight
 */
exports.resetDailyCounters = async () => {
    try {
        await db.query('UPDATE outbound_numbers SET called_today = 0');
        await db.query('UPDATE outbound_campaigns SET calls_made_today = 0');
        console.log('[Campaign-Service] Counters reset.');
    } catch (err) {
        console.error('[Campaign-Service] Reset failure:', err.message);
    }
};

/**
 * Run Daily Campaign Dialer
 * Normally would run on a cron job every morning
 */
exports.runDailyCampaign = async () => {
  try {
    const { rows: campaigns } = await db.query(
      `SELECT * FROM outbound_campaigns WHERE status = 'running'`
    );

    for (const campaign of campaigns) {
      const { rows: numbers } = await db.query(
        `SELECT phone_number FROM outbound_numbers
         WHERE campaign_id = ?
         AND last_call_status = 'pending'
         AND is_blacklisted = 0
         AND called_today = 0
         LIMIT ?`,
        [campaign.id, campaign.daily_limit]
      );

      for (const num of numbers) {
        console.log(`[Campaign-Service] Dialing ${num.phone_number} for campaign ${campaign.name}`);
        // 1. Trigger Outbound Call API (Exotel)
        // await triggerOutboundCall(campaign.company_id, num.phone_number, campaign.id);

        // 2. Update status
        await db.query(
          'UPDATE outbound_numbers SET called_today = 1, last_called_at = NOW() WHERE phone_number = ? AND campaign_id = ?',
          [num.phone_number, campaign.id]
        );
      }
      
      await db.query(
        'UPDATE outbound_campaigns SET calls_made_today = (SELECT COUNT(*) FROM outbound_numbers WHERE campaign_id = ? AND called_today = 1) WHERE id = ?',
        [campaign.id, campaign.id]
      );
    }
  } catch (err) {
    console.error('[Campaign-Service] Dialer error:', err.message);
  }
};
