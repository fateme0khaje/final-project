const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Course } = require('./Course');

const teacherSchema = new mongoose.Schema({
  fullname: {
    type: String,
    min: 5,
    max: 100,
    required: true,
    trim: true,
  },
  level: {
    type: String,
    enum: [
      'Starter',
      'Elemantary',
      'Intermediate',
      'Upper Intermediate',
      'Advance',
    ],
    default: 'Starter',
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
    default: 'teacher.png',
    required: true,
  },
  phone: {
    type: String,
    min: 5,
    max: 15,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    min: 5,
    max: 100,
  },
  role: { type: String, default: 'teacher' },
});

teacherSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  return next();
});

teacherSchema.pre('updateOne', function (next) {
  const user = this;
  if (user.getUpdate().$set.password !== undefined) {
    bcrypt.hash(user.getUpdate().$set.password, 10, (err, hash) => {
      if (err) return next(err);
      user.getUpdate().$set.password = hash;
      return next();
    });
  } else {
    return next();
  }
});
teacherSchema.pre('deleteOne', async function (next) {
  try {
    let teacher = this;
    console.log(teacher);
    await Course.updateMany(
      { teacher: teacher._conditions.id },
      {
        $set: {
          teacher: null,
        },
      }
    );
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});
const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = { Teacher };
