const db = require('../config/db');

/**
 * Main company dashboard aggregation
 */
exports.getDashboardStats = async (req, res) => {
  const { company_id } = req.user;
  try {
    const fetchMetric = async (sql, params) => {
      try {
        const { rows } = await db.query(sql, params);
        return rows[0]?.count || rows[0]?.value || 0;
      } catch (err) {
        console.error('[Analytics] Metric failed:', sql, err.message);
        return 0;
      }
    };

    // 2. Conversion Rate (WON = closed)
    const totalLeads = await fetchMetric('SELECT COUNT(*) as count FROM leads WHERE company_id = ?', [company_id]);
    const totalWon = await fetchMetric('SELECT COUNT(*) as count FROM leads WHERE company_id = ? AND status = "closed"', [company_id]);
    const conversionRate = totalLeads > 0 ? ((totalWon / totalLeads) * 100).toFixed(1) : 0;
    const totalCalls = await fetchMetric('SELECT COUNT(*) as count FROM call_logs WHERE company_id = ?', [company_id]);
    const totalEmployees = await fetchMetric('SELECT COUNT(*) as count FROM employees WHERE company_id = ? AND role = "employee"', [company_id]);
    
    // Status breakdown requires more care
    let statusBreakdown = [];
    try {
      const { rows } = await db.query(
        'SELECT status, COUNT(*) as count FROM leads WHERE company_id = ? GROUP BY status',
        [company_id]
      );
      statusBreakdown = rows;
    } catch (e) {}

    // Calculate stats for return

    res.json({
      total_leads: totalLeads,
      today_calls: totalCalls,
      conversion_rate: conversionRate,
      status_breakdown: statusBreakdown,
      total_employees: totalEmployees
    });
  } catch (err) {
    console.error('[Analytics] Dashboard aggregation failed:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Distribution of calls over time
 */
exports.getCallVolumeStats = async (req, res) => {
  const { company_id } = req.user;
  try {
    const { rows } = await db.query(`
      SELECT DATE(created_at) as date, direction, COUNT(*) as count 
      FROM call_logs 
      WHERE company_id = ? 
      GROUP BY DATE(created_at), direction 
      ORDER BY date ASC
    `, [company_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Current pipeline visualization
 */
exports.getPipelineStats = async (req, res) => {
  const { company_id } = req.user;
  try {
    const { rows } = await db.query(`
      SELECT status, COUNT(*) as value 
      FROM leads 
      WHERE company_id = ? 
      GROUP BY status
    `, [company_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
