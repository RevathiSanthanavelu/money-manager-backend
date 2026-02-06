const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');

router.post('/', authenticate, transactionController.addTransaction);
router.get('/', authenticate, transactionController.getTransactions);
router.get('/dashboard', authenticate, transactionController.getDashboard);
router.put('/:id', authenticate, transactionController.updateTransaction);
router.delete('/:id', authenticate, transactionController.deleteTransaction);

module.exports = router;


