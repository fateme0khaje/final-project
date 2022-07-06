const { Answer } = require('../models/Answer');
const { Course } = require('../models/Course');
const { Exam } = require('../models/Exam');
const { Question } = require('../models/Question');
const { Student } = require('../models/Student');

const getTeacherDash = (req, res, next) => {
  res.render('teacherdash', {
    titleText: 'استاد || داشبورد',
    path: '/teacherdash',
    layout: './layouts/dashlayout.ejs',
    teacherr: req.user,
  });
};

const getTeacherCourses = async (req, res, next) => {
  let page = req.query.page || 1;
  let coursePerPage = 15;
  try {
    let numberOfCourses = await Course.find().countDocuments();
    let courses = await Course.find({ teacher: req.user.id })
      .skip((page - 1) * coursePerPage)
      .limit(coursePerPage)
      .populate('teacher');

    res.render('teachercourses', {
      titleText: 'استاد || دوره ها و کلاس ها',
      path: '/dashboard/courses',
      layout: './layouts/dashlayout.ejs',
      teacherr: req.user,
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

    //todo error500
  }
};

const getSpeceficCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.query.courseId).populate('student', [
      'firstname',
      'lastname',
    ]);
    res.render('coursestudents', {
      titleText: 'استاد || زبان آموزان کلاس',
      path: '/teacherdash/coursestudents',
      layout: './layouts/dashlayout.ejs',
      teacherr: req.user,
      course,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const getCourseFile = async (req, res, next) => {
  try {
    let courses = await Course.find({ teacher: req.user._id });
    res.render('coursefile', {
      titleText: 'استاد || فایل ',
      path: '/teacherdash/coursefile',
      layout: './layouts/dashlayout.ejs',
      teacherr: req.user,
      courses,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const getCreateExam = async (req, res, next) => {
  try {
    let courses = await Course.find({ teacher: req.user._id });
    res.render('createexam', {
      titleText: 'استاد || ایجاد آزمون جدید',
      path: '/teacherdash/createexam',
      teacherr: req.user,
      layout: './layouts/dashlayout.ejs',
      courses,
    });
  } catch (err) {
    res.redirect('/');
  }
};

const getAddQuestion = async (req, res, next) => {
  try {
    let exams = await Exam.find({ teacher: req.user.id });
    res.render('addquestion', {
      titleText: 'استاد || اضافه کردن سوال',
      path: '/teacherdash/addquestion',
      layout: './layouts/dashlayout.ejs',
      teacherr: req.user,
      exams,
    });
  } catch (err) {
    res.redirect('/');
  }
};

const getTeacherExams = async (req, res, next) => {
  try {
    let exams = await Exam.find({ teacher: req.user.id });
    res.render('teacherexams', {
      titleText: 'استاد || امتحانات',
      path: '/teacherdash/teacherexams',
      layout: './layouts/dashlayout.ejs',
      teacherr: req.user,
      exams,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const getQuestionAndAnswers = async (req, res, next) => {
  try {
    let questions = await Question.find({ exam: req.query.examId });
    let answers = await Answer.find().populate('student', [
      'firstname',
      'lastname',
    ]);
    res.render('questionandanswers', {
      titleText: 'استاد || سوالات و پاسخ ها',
      path: '/teacherdash/questionsandanswers',
      layout: './layouts/dashlayout.ejs',
      teacherr: req.user,
      questions,
      answers,
    });
  } catch (err) {
    res.redirect('/');
  }
};

const getUpdateTeacherPassword = (req, res, next) => {
  res.render('updateteacherpassword', {
    titleText: 'ویرایش پسورد',
    path: '/teacherdash/updatepassword',
    teacherr: req.user,
    layout: './layouts/dashlayout.ejs',
  });
};

module.exports = {
  getTeacherDash,
  getTeacherCourses,
  getSpeceficCourse,
  getCourseFile,
  getCreateExam,
  getAddQuestion,
  getTeacherExams,
  getQuestionAndAnswers,
  getUpdateTeacherPassword,
};
