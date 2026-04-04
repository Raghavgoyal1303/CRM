const db = require('../config/db');

/**
 * Process Retry Queue
 * Normally would run on a cron job every 5 minutes
 */
exports.processRetryQueue = async () => {
  try {
    const { rows: due } = await db.query(
      `SELECT * FROM retry_queue
       WHERE status = "waiting"
       AND next_retry_at <= NOW()
       ORDER BY next_retry_at ASC
       LIMIT 100`
    );

    for (const item of due) {
      if (item.attempt_count >= item.max_attempts) {
        await db.query(
          'UPDATE retry_queue SET status = "abandoned" WHERE id = ?',
          [item.id]
        );
        continue;
      }

      // 1. Trigger Exotel Outbound API
      console.log(`[Retry-Service] Triggering call for ${item.phone_number} (Attempt ${item.attempt_count + 1})`);
      // await exotel.triggerOutboundCall(item.company_id, item.phone_number);

      // 2. Update entry
      await db.query(
        `UPDATE retry_queue
         SET attempt_count = attempt_count + 1,
             status = 'retrying',
             next_retry_at = NOW() + INTERVAL 5 MINUTE
         WHERE id = ?`,
        [item.id]
      );
    }
  } catch (err) {
    console.error('[Retry-Service] Processor error:', err.message);
  }
};
