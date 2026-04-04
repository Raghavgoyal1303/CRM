const db = require('../config/db');

exports.clockIn = async (req, res) => {
    const { userId } = req.body;
    const photoUrl = req.file ? `/uploads/attendance/${req.file.filename}` : null;
    const date = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        // Check if already clocked in today
        const [existing] = await db.execute(
            'SELECT * FROM attendance WHERE user_id = ? AND date = ? AND clock_out IS NULL',
            [userId, date]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Already clocked in' });
        }

        await db.execute(
            'INSERT INTO attendance (user_id, clock_in, photo_url, date) VALUES (?, ?, ?, ?)',
            [userId, now, photoUrl, date]
        );

        res.status(201).json({ message: 'Clock-in successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.clockOut = async (req, res) => {
    const { userId } = req.body;
    const date = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

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
    const date = new Date().toISOString().split('T')[0];

    try {
        const [rows] = await db.execute(
            'SELECT * FROM attendance WHERE user_id = ? AND date = ? ORDER BY created_at DESC LIMIT 1',
            [userId, date]
        );

        res.json(rows[0] || null);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAll = async (req, res) => {
    const date = new Date().toISOString().split('T')[0];

    try {
        const [rows] = await db.execute(`
            SELECT a.*, u.name as user_name, u.role 
            FROM attendance a 
            JOIN users u ON a.user_id = u.id 
            WHERE a.date = ? 
            ORDER BY a.clock_in DESC
        `, [date]);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
