// santaRoutes.js

const express = require('express');
const router = express.Router();
const santaController = require('../controllers/santaController');

router.post('/assign', santaController.assignSecretSantas);

//router.get('/assignments', santaController.getSantaAssignments);

module.exports = router;
