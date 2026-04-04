const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for Attendance Photos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads/attendance';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `attendance-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

router.post('/clock-in', upload.single('photo'), attendanceController.clockIn);
router.post('/clock-out', attendanceController.clockOut);
router.get('/status', attendanceController.getStatus);
router.get('/all', attendanceController.getAll);

module.exports = router;
