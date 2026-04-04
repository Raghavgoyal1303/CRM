const xlsx = require('xlsx');
const { query } = require('../config/db');

const generateTokenNumber = async (campaignId) => {
  const result = await query(
    'SELECT COUNT(*) as count FROM lottery_participants WHERE campaign_id = ?',
    [campaignId]
  );
  const count = (result.rows[0]?.count || 0) + 1;
  return `ERT-${String(count).padStart(6, '0')}`;
};

const importParticipants = async (filePath, campaignId, companyId, addedBy) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  const results = { success: 0, errors: [], duplicates: [] };

  for (const row of rows) {
    try {
      const phone = String(row.phone_number || '').replace(/\D/g, '');
      const aadhar = String(row.aadhar || '').replace(/\D/g, '');

      if (phone.length !== 10) {
        results.errors.push({ row, reason: 'Invalid phone number (must be 10 digits)' });
        continue;
      }

      if (aadhar && aadhar.length !== 12) {
        results.errors.push({ row, reason: 'Invalid Aadhar number (must be 12 digits)' });
        continue;
      }

      // Check duplicate Aadhar in this campaign
      if (aadhar) {
        const existing = await query(
          'SELECT id FROM lottery_participants WHERE aadhar_number = ? AND campaign_id = ?',
          [aadhar, campaignId]
        );
        if (existing.rows.length > 0) {
          results.duplicates.push({ row, reason: 'Duplicate Aadhar number' });
          continue;
        }
      }

      const tokenNumber = row.token_number || await generateTokenNumber(campaignId);

      await query(
        `INSERT INTO lottery_participants
         (id, company_id, campaign_id, token_number, full_name,
          father_name, date_of_birth, phone_number, email,
          address_line1, city, state, pincode,
          aadhar_number, pan_number,
          payment_status, payment_method, payment_amount,
          added_by, source)
         VALUES (UUID(),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          companyId,
          campaignId,
          tokenNumber,
          row.full_name || 'Unknown',
          row.father_name || null,
          row.dob || null,
          phone,
          row.email || null,
          row.address1 || '',
          row.city || '',
          row.state || '',
          row.pincode || '',
          aadhar || null,
          row.pan || null,
          row.payment_status || 'pending',
          row.payment_method || null,
          row.payment_amount || 1100.00,
          addedBy,
          'excel_import'
        ]
      );

      results.success++;
    } catch (err) {
      results.errors.push({ row, reason: err.message });
    }
  }

  return results;
};

module.exports = { importParticipants };
