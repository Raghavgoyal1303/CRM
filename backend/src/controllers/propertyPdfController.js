const db = require('../config/db'); 

/**
 * Lightweight Property Data Fetcher
 * Optimized to send raw data to frontend for professional PDF client-side rendering.
 * This avoids Puppeteer timeout issues on local Windows environments.
 */
exports.generatePropertyPDF = async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user;

  try {
    const { rows } = await db.query('SELECT * FROM properties WHERE id = ? AND company_id = ?', [id, company_id]);
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Send property data to frontend for PDF generation
    res.status(200).json(rows[0]);

  } catch (err) {
    console.error('[PDF ENGINE ERROR]:', err);
    res.status(500).json({ message: 'Failed to fetch property details for export' });
  }
};
