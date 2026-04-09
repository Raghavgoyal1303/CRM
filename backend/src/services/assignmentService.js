const db = require('../config/db');

/**
 * Assigns a lead to the next available employee in a company using Round-Robin.
 * @param {string} companyId - The ID of the company
 * @returns {Promise<string|null>} - The ID of the assigned employee
 */
const assignRoundRobin = async (companyId) => {
  try {
    // 1. Get ONLY Online Employees (Photography Attendance Rule)
    // Rule: Green only if clocked-in TODAY + No clock-out + Photo exists
    const { rows: employees } = await db.query(`
      SELECT e.id FROM employees e
      INNER JOIN attendance a ON e.id = a.user_id AND a.date = CURDATE()
      WHERE e.company_id = ? AND e.is_active = 1 AND a.clock_out IS NULL AND a.photo_url IS NOT NULL
      ORDER BY e.created_at ASC
    `, [companyId]);

    if (employees.length === 0) {
      console.log(`[Round Robin] No agents online for company ${companyId}`);
      return null;
    }


    // 2. Get the current pointer for this company
    const { rows: pointers } = await db.query(
      'SELECT last_index FROM assignment_pointers WHERE company_id = ?',
      [companyId]
    );

    let nextIndex = 0;
    if (pointers.length > 0) {
      nextIndex = (pointers[0].last_index + 1) % employees.length;
      // Update pointer
      await db.query(
        'UPDATE assignment_pointers SET last_index = ? WHERE company_id = ?',
        [nextIndex, companyId]
      );
    } else {
      // First time assignment for this company
      await db.query(
        'INSERT INTO assignment_pointers (company_id, last_index) VALUES (?, ?)',
        [companyId, 0]
      );
    }

    return employees[nextIndex].id;
  } catch (err) {
    console.error('Round-Robin Assignment Error:', err);
    return null;
  }
};

module.exports = { assignRoundRobin };
