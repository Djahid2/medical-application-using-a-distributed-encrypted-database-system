const express = require('express');
const { register, verifyCode, login } = require('../Controller/authController');

const router = express.Router();

router.post('/register', register);
router.post('/verify-code', verifyCode);
router.post('/login', login);

module.exports = router;
