const db = require('../config/db');

/**
 * Main company dashboard aggregation
 */
exports.getDashboardStats = async (req, res) => {
  const { company_id, role, id: user_id } = req.user;
  try {
    const fetchMetric = async (sql, params) => {
      try {
        const { rows } = await db.query(sql, params);
        return rows[0]?.count || 0;
      } catch (err) {
        console.error('[Analytics] Metric failed:', err.message);
        return 0;
      }
    };

    let leadFilter = 'WHERE company_id = ?';
    const params = [company_id];

    if (role === 'employee') {
      leadFilter += ' AND assigned_to = ?';
      params.push(user_id);
    }

    const totalLeads = await fetchMetric(`SELECT COUNT(*) as count FROM leads ${leadFilter}`, params);
    const contactedLeads = await fetchMetric(`SELECT COUNT(*) as count FROM leads ${leadFilter} AND status = "contacted"`, params);
    const interestedLeads = await fetchMetric(`SELECT COUNT(*) as count FROM leads ${leadFilter} AND status = "interested"`, params);
    const closedLeads = await fetchMetric(`SELECT COUNT(*) as count FROM leads ${leadFilter} AND status = "closed"`, params);
    
    // Status breakdown
    const { rows: statusRows } = await db.query(
      `SELECT status, COUNT(*) as count FROM leads ${leadFilter} GROUP BY status`,
      params
    );

    const statusCounts = statusRows.reduce((acc, curr) => {
      acc[curr.status] = curr.count;
      return acc;
    }, {});

    res.json({
      totalLeads,
      contactedLeads,
      interestedLeads,
      closedLeads,
      statusCounts
    });
  } catch (err) {
    console.error('[Analytics] Dashboard aggregation failed:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Get performance metrics for all employees (for Admin table)
 */
exports.getEmployeePerformance = async (req, res) => {
  const { company_id } = req.user;
  try {
    const { rows } = await db.query(`
      SELECT 
        e.id as employee_id,
        e.name as employee_name,
        COUNT(l.id) as total_leads,
        SUM(CASE WHEN l.status = 'closed' THEN 1 ELSE 0 END) as closed_leads,
        ROUND((SUM(CASE WHEN l.status = 'closed' THEN 1 ELSE 0 END) / NULLIF(COUNT(l.id), 0)) * 100, 1) as conversion_rate
      FROM employees e
      LEFT JOIN leads l ON e.id = l.assigned_to
      WHERE e.company_id = ? AND e.role = 'employee' AND e.deleted_at IS NULL
      GROUP BY e.id, e.name
    `, [company_id]);
    
    res.json(rows);
  } catch (err) {
    console.error('[Analytics] Employee performance failed:', err);
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
