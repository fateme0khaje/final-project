const { Course } = require('../models/Course');
const path = require('path');
const appRoot = require('app-root-dir').get();
const shortId = require('shortid');
const bcrypt = require('bcryptjs');

const { Exam } = require('../models/Exam');
const { Question } = require('../models/Question');
const { Teacher } = require('../models/Teacher');
const { Answer } = require('../models/Answer');

const addFileToCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.body.course);
    let file = req.files.file;
    let fileName = `${shortId.generate()}_${file.name}`;
    let storagePath = path.join(appRoot, 'public', 'files', fileName);
    file.mv(storagePath);
    course.file.push(fileName);
    await Course.updateOne({ _id: course.id }, { $set: { file: course.file } });
    res.redirect('/teacherdash');
  } catch (err) {
    console.log(err);
    // error 500
    res.redirect('/');
  }
};

const createExam = async (req, res, next) => {
  try {
    let course = await Course.findById(req.body.course);
    if (course) {
      await Exam.create({
        ...req.body,
        teacher: req.user.id,
        student: course.student,
      });
      res.redirect('/teacherdash');
    }
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const addQuestion = async (req, res, next) => {
  try {
    await Question.create(req.body);
    res.redirect('/teacherdash');
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const updateTeacherPassword = async (req, res, next) => {
  try {
    let teacher = await Teacher.findById(req.query.teacherId);
    let password = req.body.password;
    let repeatPassword = req.body.repeatPassword;
    if (password === repeatPassword) {
      if (teacher && password) {
        let hash = await bcrypt.hash(password, 10);
        await Teacher.findOneAndUpdate(teacher._id, {
          $set: { password: hash },
        });
        res.redirect('/teacherdash');
      }
    } else {
      res.render('updateteacherpassword', {
        titleText: 'ویرایش پسورد',
        path: '/teacherdash/updatepassword',
        teacherr: req.user,
        layout: './layouts/dashlayout.ejs',
        err: ['گذر واژه ها نا معتبر می باشند'],
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const setMark = async (req, res, next) => {
  try {
    let { answerId, mark } = req.body;
    if (answerId && mark) {
      await Answer.updateOne({ _id: answerId }, { $set: { mark } });
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addFileToCourse,
  createExam,
  addQuestion,
  updateTeacherPassword,
  setMark,
};
