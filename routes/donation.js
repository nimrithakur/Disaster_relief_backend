const express = require('express');
const router = express.Router();
const { createDonation, listDonations, updateStatus, totals } = require('../controllers/donationController');
const { protect, requireRole } = require('../middleware/auth');

router.post('/', protect, createDonation);
router.get('/', listDonations);
router.put('/:id/status', protect, requireRole(['volunteer','admin']), updateStatus);
router.get('/totals', totals);

module.exports = router;
