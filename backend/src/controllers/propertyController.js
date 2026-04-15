const { query } = require('../config/db');
const { randomUUID } = require('crypto');

exports.getProperties = async (req, res) => {
  const { company_id } = req.user;
  try {
    const { rows } = await query(
      'SELECT * FROM properties WHERE company_id = ? ORDER BY created_at DESC',
      [company_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createProperty = async (req, res) => {
  const { company_id } = req.user;
  const { name, description, price, location, property_type, ownership, details } = req.body;
  const id = randomUUID();
  
  const media = req.files ? req.files.map(file => `/uploads/properties/${file.filename}`) : [];

  try {
    await query(
      `INSERT INTO properties (id, company_id, name, description, price, location, property_type, ownership, details, media) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, 
        company_id, 
        name, 
        description, 
        price || 0, 
        location, 
        property_type, 
        ownership, 
        JSON.stringify(details || {}), 
        JSON.stringify(media)
      ]
    );
    res.status(201).json({ id, message: 'Property listed successfully', media });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateProperty = async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user;
  const { name, description, price, location, property_type, ownership, details } = req.body;
  
  try {
    // Basic fields update
    let updateQuery = `UPDATE properties SET name = ?, description = ?, price = ?, location = ?, property_type = ?, ownership = ?, details = ?`;
    let queryParams = [name, description, price, location, property_type, ownership, JSON.stringify(details || {})];

    // If new files are uploaded, append them to the existing media OR replace it
    // For now, we'll append new media if files are provided
    if (req.files && req.files.length > 0) {
      const newMedia = req.files.map(file => `/uploads/properties/${file.filename}`);
      
      // Get existing media first
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
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteProperty = async (req, res) => {
  const { id } = req.params;
  const { company_id } = req.user;
  try {
    await query('DELETE FROM properties WHERE id = ? AND company_id = ?', [id, company_id]);
    res.json({ message: 'Property removed from inventory' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
