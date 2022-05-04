const express = require('express');
const router = express.Router();
const jwt = require('../jwt');

const TransactionController = require('../controllers/TransactionController');

router.get('/data', jwt.verify, TransactionController.getAll);
router.post('/create', jwt.verify, TransactionController.create);
router.get('/history', jwt.verify, TransactionController.getHistory);
router.post('/get', jwt.verify, TransactionController.get);

module.exports = router;