const db = require('../config/db');

/**
 * Assigns a lead to the next available employee in a company using Round-Robin.
 * @param {string} companyId - The ID of the company
 * @returns {Promise<string|null>} - The ID of the assigned employee
 */
const assignRoundRobin = async (companyId) => {
  try {
    // 1. Get all active employees for this company (role = employee or admin)
    const { rows: employees } = await db.query(
      'SELECT id FROM employees WHERE company_id = ? AND is_active = 1 AND role != "superadmin" ORDER BY created_at ASC',
      [companyId]
    );

    if (employees.length === 0) return null;

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
