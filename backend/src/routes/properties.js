const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');
const upload = require('../utils/uploader');

// All property routes are protected
router.use(protect);

router.get('/', propertyController.getProperties);

// We use upload.array('media', 10) to support multi-file uploads (up to 10 files)
router.post('/', upload.array('media', 10), propertyController.createProperty);

router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

module.exports = router;
