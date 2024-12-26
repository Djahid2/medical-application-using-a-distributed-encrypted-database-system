const express = require('express');
const { register, verifyCode, login,VerfAdmin } = require('../Controller/authController');

const router = express.Router();

router.post('/register', register);
router.post('/verify-code', verifyCode);
router.post('/login', login);
router.post('/VerfAdmin',VerfAdmin)

module.exports = router;
