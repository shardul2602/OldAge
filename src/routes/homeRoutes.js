const express = require('express');
const router = express.Router();
const { getHomes, createHome } = require('../controllers/homeController');
const { requireRole } = require('../middlewares/auth');

router.get('/', getHomes);
router.post('/', requireRole('admin'), createHome);

module.exports = router;
