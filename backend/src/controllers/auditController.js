const { query } = require('../config/db');

const auditController = {
  getLogs: async (req, res) => {
    try {
      const { page = 1, limit = 50, search = '', action = '', employee_id = '' } = req.query;
      const offset = (page - 1) * limit;
      
      let sql = 'SELECT al.*, e.name as employee_name FROM audit_logs al LEFT JOIN employees e ON al.performed_by = e.id';
      let params = [];
      let where = [];

      // If not superadmin, only show logs for their company
      if (req.user.role !== 'superadmin') {
        where.push('al.company_id = ?');
        params.push(req.user.company_id);
      }

      if (action) {
        where.push('al.action = ?');
        params.push(action);
      }

      if (employee_id) {
        where.push('al.performed_by = ?');
        params.push(employee_id);
      }

      if (search) {
        where.push('(al.entity_type LIKE ? OR al.action LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
      }

      if (where.length > 0) {
        sql += ' WHERE ' + where.join(' AND ');
      }

      sql += ' ORDER BY al.created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));

      const result = await query(sql, params);
      const totalSql_where = where.length > 0 ? ' WHERE ' + where.join(' AND ') : '';
      const totalSql = `SELECT COUNT(*) as count FROM audit_logs ${totalSql_where}`;
      const totalResult = await query(totalSql, params.slice(0, params.length - 2));

      res.json({
        logs: result.rows,
        pagination: {
          total: totalResult.rows[0].count,
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  logAction: async (companyId, performedBy, action, entityType, entityId, oldValue, newValue, ipAddress) => {
    try {
      await query(
        `INSERT INTO audit_logs (id, company_id, performed_by, action, entity_type, entity_id, old_value, new_value, ip_address) 
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)`,
        [companyId, performedBy, action, entityType, entityId, JSON.stringify(oldValue), JSON.stringify(newValue), ipAddress]
      );
    } catch (err) {
      console.error('Failed to log audit action:', err);
    }
  }
};

module.exports = auditController;
