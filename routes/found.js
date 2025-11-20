const express = require('express');
const router = express.Router();
const { createFound, listFound } = require('../controllers/foundController');
const { protect, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, requireRole(['volunteer','admin']), upload.array('photos', 6), createFound);
router.get('/', listFound);

module.exports = router;
