const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studetnSchema = new mongoose.Schema({
  firstname: {
    type: String,
    min: 2,
    max: 50,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    min: 2,
    max: 50,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    max: 70,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    min: 4,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    min: 5,
    max: 15,
    trim: true,
  },
  image: {
    type: String,
    default: 'studentavatar.png',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'student',
  },
  course: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
    },
  ],
  exam: [{ type: mongoose.Types.ObjectId, ref: 'Exam' }],
});

studetnSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  return next();
});

const Student = mongoose.model('Student', studetnSchema);

module.exports = { Student };
