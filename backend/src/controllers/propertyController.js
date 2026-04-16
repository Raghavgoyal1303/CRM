const { query } = require('../config/db');
const { randomUUID } = require('crypto');

exports.getProperties = async (req, res) => {
  const { company_id, id: userId, role } = req.user;
  try {
    // Visibility Logic:
    // 1. Superadmin/Admin: See everything in the company
    // 2. Employee: See 'public' properties OR those created by themselves (private)
    let sql = 'SELECT * FROM properties WHERE company_id = ?';
    let params = [company_id];

    if (role !== 'admin' && role !== 'superadmin') {
      sql += ' AND (visibility = "public" OR created_by_id = ?)';
      params.push(userId);
    }

    sql += ' ORDER BY created_at DESC';

    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('[Properties] Fetch Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createProperty = async (req, res) => {
  const { company_id, id: userId } = req.user;
  const { name, description, price, location, property_type, ownership, details, visibility } = req.body;
  const id = randomUUID();
  
  const media = req.files ? req.files.map(file => `/uploads/properties/${file.filename}`) : [];

  try {
    // Ensure details is an object/json
    const detailsJson = typeof details === 'string' ? details : JSON.stringify(details || {});

    await query(
      `INSERT INTO properties (id, company_id, created_by_id, name, description, price, location, property_type, ownership, details, media, visibility) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, 
        company_id, 
        userId,
        name, 
        description, 
        price || 0, 
        location, 
        property_type, 
        ownership, 
        detailsJson, 
        JSON.stringify(media),
        visibility || 'public'
      ]
    );
    res.status(201).json({ id, message: 'Property listed successfully', media });
  } catch (err) {
    console.error('[Properties] Create Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateProperty = async (req, res) => {
  const { id } = req.params;
  const { company_id, id: userId, role } = req.user;
  const { name, description, price, location, property_type, ownership, details, visibility } = req.body;
  
  try {
    // Determine if user has permission to update
    const { rows: existing } = await query('SELECT created_by_id FROM properties WHERE id = ? AND company_id = ?', [id, company_id]);
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (role !== 'admin' && role !== 'superadmin' && existing[0].created_by_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to edit this property' });
    }

    // Basic fields update
    let updateQuery = `UPDATE properties SET name = ?, description = ?, price = ?, location = ?, property_type = ?, ownership = ?, details = ?, visibility = ?`;
    let queryParams = [name, description, price, location, property_type, ownership, JSON.stringify(details || {}), visibility || 'public'];

    if (req.files && req.files.length > 0) {
      const newMedia = req.files.map(file => `/uploads/properties/${file.filename}`);
      const { rows } = await query('SELECT media FROM properties WHERE id = ? AND company_id = ?', [id, company_id]);
      if (rows.length > 0) {
        const existingMedia = typeof rows[0].media === 'string' ? JSON.parse(rows[0].media || '[]') : (rows[0].media || []);
        const totalMedia = [...existingMedia, ...newMedia];
        updateQuery += `, media = ?`;
        queryParams.push(JSON.stringify(totalMedia));
      }
    }

    updateQuery += ` WHERE id = ? AND company_id = ?`;
    queryParams.push(id, company_id);

    await query(updateQuery, queryParams);
    res.json({ message: 'Property details updated successfully' });
  } catch (err) {
    console.error('[Properties] Update Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteProperty = async (req, res) => {
  const { id } = req.params;
  const { company_id, id: userId, role } = req.user;
  try {
    const { rows: existing } = await query('SELECT created_by_id FROM properties WHERE id = ? AND company_id = ?', [id, company_id]);
    
    if (existing.length > 0 && role !== 'admin' && role !== 'superadmin' && existing[0].created_by_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this property' });
    }

    await query('DELETE FROM properties WHERE id = ? AND company_id = ?', [id, company_id]);
    res.json({ message: 'Property removed from inventory' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
