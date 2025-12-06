const express = require('express');
const router = express.Router();
const { singup, login } = require('../controller/userController');

router.post('/singup', singup);
router.post('/login', login);

module.exports = router;