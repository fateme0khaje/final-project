const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  body: { type: String, required: true },
  question: { type: mongoose.Types.ObjectId, required: true, ref: 'Question' },
  student: { type: mongoose.Types.ObjectId, required: true, ref: 'Student' },
  mark: { type: Number, default: 0 },
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = { Answer };
