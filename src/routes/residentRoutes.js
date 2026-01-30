const express = require('express');
const {
  createResident,
  getResidents,
  getResidentById,
  updateResident,
  deleteResident,
} = require('../controllers/residentController');
const { requireRole } = require('../middlewares/auth');

const router = express.Router();

router.post('/', requireRole('admin'), createResident);
router.get('/', getResidents);
router.get('/:id', getResidentById);
router.put('/:id', requireRole('admin'), updateResident);
router.delete('/:id', requireRole('admin'), deleteResident);

module.exports = router;
