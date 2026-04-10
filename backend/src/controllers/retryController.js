const db = require('../config/db');

exports.getRetryQueue = async (req, res) => {
  const { company_id } = req.user;
  try {
    const { rows } = await db.query(
      `SELECT rq.*, oc.name as campaign_name 
       FROM retry_queue rq
       LEFT JOIN outbound_campaigns oc ON rq.campaign_id = oc.id
       WHERE rq.company_id = ? AND rq.status = 'pending'
       ORDER BY rq.next_retry_at ASC`,
      [company_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.processManualRetry = async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user;
  try {
    // In a production environment, this would call the dialer service immediately
    await db.query(
      `UPDATE retry_queue SET status = 'retrying', retry_count = retry_count + 1 WHERE id = ? AND company_id = ?`,
      [id, company_id]
    );
    res.json({ success: true, message: 'Retry operation initiated' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
