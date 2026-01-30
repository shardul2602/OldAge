const express = require('express');
const { register, login, googleUpsert } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-upsert', googleUpsert);

module.exports = router;
