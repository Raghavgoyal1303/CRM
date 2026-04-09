const db = require('../config/db');

exports.clockIn = async (req, res) => {
    const { userId } = req.body;
    const photoUrl = req.file ? `/uploads/attendance/${req.file.filename}` : null;
    // Calculate IST Date (UTC+5:30) for consistency across company operating hours
    const nowIST = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
    const date = nowIST.toISOString().split('T')[0];
    const now = nowIST.toISOString().slice(0, 19).replace('T', ' ');

    try {
        console.log('[Attendance] Clock-in attempt for:', userId, 'at Date:', date);
        
        // Check if already clocked in today
        const [existing] = await db.execute(
            'SELECT * FROM attendance WHERE user_id = ? AND date = ? AND clock_out IS NULL',
            [userId, date]
        );

        if (existing.length > 0) {
            console.warn('[Attendance] Already clocked in today:', userId);
            return res.status(400).json({ message: 'Already clocked in' });
        }

        await db.execute(
            'INSERT INTO attendance (user_id, clock_in, photo_url, date) VALUES (?, ?, ?, ?)',
            [userId, now, photoUrl, date]
        );

        console.log('[Attendance] Clock-in successful:', userId);
        res.status(201).json({ message: 'Clock-in successful' });
    } catch (error) {
        console.error('[Attendance] Clock-in execution error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

exports.clockOut = async (req, res) => {
    const { userId } = req.body;
    const nowIST = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
    const date = nowIST.toISOString().split('T')[0];
    const now = nowIST.toISOString().slice(0, 19).replace('T', ' ');

    try {
        const [existing] = await db.execute(
            'SELECT * FROM attendance WHERE user_id = ? AND date = ? AND clock_out IS NULL',
            [userId, date]
        );

        if (existing.length === 0) {
            return res.status(400).json({ message: 'No active clock-in found' });
        }

        await db.execute(
            'UPDATE attendance SET clock_out = ?, status = "inactive" WHERE id = ?',
            [now, existing[0].id]
        );

        res.json({ message: 'Clock-out successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStatus = async (req, res) => {
    const { userId } = req.query;

    try {
        const [rows] = await db.execute(
            'SELECT * FROM attendance WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
            [userId]
        );

        if (rows.length > 0) {
            const row = rows[0];
            
            // Helper to ensure database DATETIME is treated as UTC
            const formatUTC = (dateVal) => {
                if (!dateVal) return null;
                const d = new Date(dateVal);
                const pad = (n) => n.toString().padStart(2, '0');
                // Construct ISO string assuming the DB hours ARE the UTC hours
                return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.000Z`;
            };

            if (row.clock_in) row.clock_in = formatUTC(row.clock_in);
            if (row.clock_out) row.clock_out = formatUTC(row.clock_out);
            res.json(row);
        } else {
            res.json(null);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAll = async (req, res) => {
    const nowIST = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
    const date = nowIST.toISOString().split('T')[0];

    try {
        const [rows] = await db.execute(`
            SELECT a.*, e.name as user_name, e.role 
            FROM attendance a 
            JOIN employees e ON a.user_id = e.id 
            WHERE a.date = ? 
            ORDER BY a.clock_in DESC
        `, [date]);

        const formatUTC = (dateVal) => {
            if (!dateVal) return null;
            const d = new Date(dateVal);
            const pad = (n) => n.toString().padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.000Z`;
        };

        const formattedRows = rows.map(row => ({
            ...row,
            clock_in: formatUTC(row.clock_in),
            clock_out: formatUTC(row.clock_out)
        }));

        res.json(formattedRows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
