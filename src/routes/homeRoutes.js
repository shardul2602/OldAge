const express = require('express');
const router = express.Router();
const { getHomes, createHome } = require('../controllers/homeController');
const { requireSuperAdmin } = require('../middlewares/auth');

router.get('/', getHomes);
router.post('/', requireSuperAdmin, createHome);

module.exports = router;
