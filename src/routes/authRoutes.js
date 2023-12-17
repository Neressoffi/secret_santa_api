const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Pour la route register
router.post('/register', authController.register);
// Pour la route login
router.post('/login', authController.login);

module.exports = router;
