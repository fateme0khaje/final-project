const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: { type: String, max: 50, required: true, trim: true },
  level: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  question: [{ type: mongoose.Types.ObjectId, ref: 'Question' }],
  teacher: { type: mongoose.Types.ObjectId, ref: 'Teacher' },
  student: [{ type: mongoose.Types.ObjectId, ref: 'Student' }],
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = { Exam };
