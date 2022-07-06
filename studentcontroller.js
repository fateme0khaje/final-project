const { Course } = require('../models/Course');
const { Question } = require('../models/Question');
const { Student } = require('../models/Student');
const { Answer } = require('../models/Answer');

const registerStudent = async (req, res, next) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });
    if (!student) {
      await Student.create({ ...req.body });
      req.flash('message', 'با موفقیت ثبت نام کردید');
      return res.redirect('/login');
    }
    res.render('register', {
      titleText: 'ثبت نام',
      path: '/register',
      err: ['شما قبلا ثبت نام کردید'],
      message: [req.flash('message')],
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const registerOnCourse = async (req, res, next) => {
  try {
    if (req?.user?.role === 'student') {
      let course = await Course.findById(req.query.courseId);
      let student = req.user;
      if (student.course.includes(course.id)) {
        return res.redirect('/studash/courses');
      }
      course.student.push(req.user.id);
      await Course.updateOne(
        { _id: course.id },
        { $set: { student: course.student } }
      );
      student.course.push(course.id);
      await Student.updateOne(
        { _id: student.id },
        { $set: { course: student.course } }
      );
      res.redirect('/studash/courses');
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const answerTheQuestion = async (req, res, next) => {
  try {
    await Answer.create({
      ...req.body,
      student: req.user.id,
    });
    res.status(200).json({ message: 'پاسخ شما ثبت شد' });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

module.exports = { registerStudent, registerOnCourse, answerTheQuestion };
