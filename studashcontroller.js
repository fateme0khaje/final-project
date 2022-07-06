const { Course } = require('../models/Course');
const { Exam } = require('../models/Exam');
const { Student } = require('../models/Student');
const { Teacher } = require('../models/Teacher');
const { Question } = require('../models/Question');
const { Answer } = require('../models/Answer');

const getStuDash = (req, res, next) => {
  res.render('studash', {
    titleText: 'زبان آموز || داشبورد',
    path: '/studash',
    layout: './layouts/dashlayout.ejs',
    student: req.user,
  });
};

const getCourses = async (req, res, next) => {
  let page = req.query.page || 1;
  let coursePerPage = 15;
  try {
    let student = await Student.findById(req.user.id).populate('course');
    let courses2 = student.course;
    let numberOfCourses = courses2.length;
    let courses = courses2.splice(page - 1, coursePerPage);
    res.render('stucourses', {
      titleText: 'زبان آموز || داشبورد',
      path: '/studash/courses',
      layout: './layouts/dashlayout.ejs',
      student: req.user,
      courses,
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: coursePerPage * page < numberOfCourses,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfCourses / coursePerPage),
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const getStudentExams = async (req, res, next) => {
  try {
    let temp = await Exam.find().populate('teacher');
    let exams = [];
    for (let t of temp) {
      if (t.student.includes(req.user.id)) {
        exams.push(t);
      }
    }
    res.render('studentexams', {
      titleText: 'امتحانات شما',
      path: '/studash/exams',
      layout: './layouts/dashlayout.ejs',
      student: req.user,
      exams,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const getExamQuestions = async (req, res, next) => {
  try {
    let questions = await Question.find({ exam: req.query.examId });
    res.render('studentexam', {
      titleText: 'امتحان',
      path: '/studash/exams',
      layout: './layouts/dashlayout.ejs',
      student: req.user,
      questions,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const getMarks = async (req, res, next) => {
  try {
    let temp = [];
    let examId = req.query.examId;
    let questions = await Question.find({ exam: examId });
    let answers = await Answer.find({ student: req.user._id }).populate(
      'question'
    );
    questions.forEach((q) => {
      answers.forEach((a) => {
        if (a.question._id.toString() === q._id.toString()) {
          temp.push(a);
        }
      });
    });

    res.render('exam-marks', {
      titleText: 'نمرات',
      path: '/studash/exammarks',
      layout: './layouts/dashlayout.ejs',
      answers: temp,
      student: req.user,
    });
  } catch (error) {}
};

module.exports = {
  getStuDash,
  getCourses,
  getStudentExams,
  getExamQuestions,
  getMarks,
};
