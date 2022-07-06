const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  body: { type: String, max: 500, required: true },
  exam: { type: mongoose.Types.ObjectId, ref: 'Exam' },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = { Question };
