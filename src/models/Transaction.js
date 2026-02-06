const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['salary', 'freelance', 'fuel', 'movie', 'food', 'loan', 'medical', 'utilities', 'entertainment', 'shopping', 'transport', 'other'],
  },
  division: {
    type: String,
    enum: ['office', 'personal'],
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  editableUntil: {
    type: Date,
    default: function() {
      return new Date(this.createdAt.getTime() + 12 * 60 * 60 * 1000); // 12 hours
    },
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
