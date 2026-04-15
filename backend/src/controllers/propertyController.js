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
  
  // Extract file paths from uploaded files
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
    await query(
      `UPDATE properties SET name = ?, description = ?, price = ?, location = ?, property_type = ?, ownership = ?, details = ?
       WHERE id = ? AND company_id = ?`,
      [name, description, price, location, property_type, ownership, JSON.stringify(details || {}), id, company_id]
    );
    res.json({ message: 'Property details updated' });
  } catch (err) {
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
