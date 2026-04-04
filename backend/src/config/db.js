const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'leadflow_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper for row-based queries (Standard)
const query = async (text, params) => {
  const [rows] = await pool.query(text, params);
  return { rows };
};

/**
 * Atomic Transaction Helper
 * Ensures all queries inside the callback use the SAME connection.
 */
const transaction = async (callback) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { query, pool, transaction };