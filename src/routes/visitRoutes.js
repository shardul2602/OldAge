const express = require('express');
const { createVisit, listVisits, getVisit, updateVisit, deleteVisit } = require('../controllers/visitController');
const { requireRole } = require('../middlewares/auth');

const router = express.Router();

router.post('/', requireRole('volunteer'), createVisit);
router.get('/', listVisits);
router.get('/:id', getVisit);
router.put('/:id', requireRole('volunteer'), updateVisit);
router.delete('/:id', requireRole('volunteer'), deleteVisit);

module.exports = router;
