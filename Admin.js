const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  fullname: {
    type: String,
    min: 5,
    max: 100,
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
  image: {
    type: String,
    default: 'adminavatar.png',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'admin',
  },
});

adminSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  return next();
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = { Admin };
