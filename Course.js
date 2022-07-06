const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 3,
    max: 75,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    min: 100,
    max: 2100,
    required: true,
    trim: true,
  },
  image: { type: String },
  level: {
    type: String,
    enum: [
      'Starter',
      'Elemantary',
      'Intermediate',
      'Upper intermediate',
      'Advance',
    ],
    default: 'Starter',
  },
  price: {
    type: String,
    default: 0,
  },
  sessionTime: {
    type: Number,
    trim: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  teacher: {
    type: mongoose.Types.ObjectId,
    ref: 'Teacher',
  },
  student: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Student',
    },
  ],
  file: [{ type: String }],
});

// courseSchema.pre('deleteOne', async function (next) {
//   try {
//     let teacher = this;
//     await Course.updateMany(
//       { teacher: teacher._conditions.id },
//       {
//         $set: {
//           teacher: null,
//         },
//       }
//     );
//     next();
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// });

const Course = mongoose.model('Course', courseSchema);

module.exports = { Course };
