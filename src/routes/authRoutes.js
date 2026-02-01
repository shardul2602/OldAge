const express = require('express');
const { register, login, googleUpsert, exists } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-upsert', googleUpsert);
router.get('/exists', exists);

module.exports = router;
