const express = require('express');
const router = express.Router();
const jwt = require('../jwt');

const UserController = require('../controllers/UserController');

// router.post('/report', jwt.verify, UserController.report);

module.exports = router;