// const express = require('express');
// const router = express.Router();
// const { createMissing, listMissing, getMissing, updateStatus } = require('../controllers/missingController');
// const { protect, requireRole } = require('../middleware/auth');
// const upload = require('../middleware/upload');
// const { create } = require('../models/MissingPerson');

// router.post('/', protect, upload.array('photos', 6), createMissing);
// router.get('/', listMissing);
// router.get('/:id', getMissing);
// router.put('/:id/status', protect, requireRole(['volunteer','admin']), updateStatus);
// router.post("/", createMissing)

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createMissing,
  listMissing,
  getMissing,
  updateStatus,
} = require('../controllers/missingController');
const { protect, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, upload.array('photos', 6), createMissing);
router.get('/', listMissing);
router.get('/:id', getMissing);
router.put('/:id/status', protect, requireRole(['volunteer','admin']), updateStatus);

module.exports = router;
