const Transaction = require('../models/Transaction');

exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, category, division, description, date } = req.body;

    const transaction = new Transaction({
      userId: req.userId,
      type,
      amount,
      category,
      division,
      description,
      date: new Date(date),
    });

    await transaction.save();
    res.status(201).json({ message: 'Transaction added successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category, division, type } = req.query;
    
    const filter = { userId: req.userId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (category) filter.category = category;
    if (division) filter.division = division;
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    let startDate = new Date();
    
    if (period === 'monthly') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'weekly') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'yearly') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const transactions = await Transaction.find({
      userId: req.userId,
      date: { $gte: startDate },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryBreakdown = {};

    transactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }

      if (!categoryBreakdown[transaction.category]) {
        categoryBreakdown[transaction.category] = 0;
      }
      categoryBreakdown[transaction.category] += transaction.amount;
    });

    res.json({
      period,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryBreakdown,
      transactionCount: transactions.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (new Date() > transaction.editableUntil) {
      return res.status(400).json({ message: 'Transaction cannot be edited after 12 hours' });
    }

    Object.assign(transaction, req.body);
    await transaction.save();

    res.json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
