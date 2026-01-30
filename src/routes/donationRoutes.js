const express = require('express');
const { addDonation, listDonations, getTotal } = require('../controllers/donationController');
const { requireRole } = require('../middlewares/auth');

const router = express.Router();

router.post('/', requireRole('admin'), addDonation);
router.get('/', listDonations);
router.get('/total', getTotal);

module.exports = router;
