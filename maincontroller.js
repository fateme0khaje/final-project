const passport = require('passport');
const { Course } = require('../models/Course');
const { Teacher } = require('../models/Teacher');
const { router } = require('../routes/mainrouter');
const { truncateTo200 } = require('../utils/truncate');
const { Blog } = require('../models/Blog');
const path = require('path');
const { Student } = require('../models/Student');
const appRoot = require('app-root-dir').get();

const getHome = async (req, res, next) => {
  try {
    let courses = await Course.find()
      .sort([['createdAt', 'ascending']])
      .limit(3);
    let teachers = await Teacher.find().limit(4);
    res.render('index', {
      titleText: ' آموزشگاه زبان',
      path: '/',
      courses,
      teachers,
      truncateTo200,
    });
  } catch (err) {
    res.redirect('/');

    console.log(err);
  }
};

const getAdminLogin = (req, res, next) => {
  let err = req.flash('error');

  res.render('adminlogin', {
    titleText: 'ورود مدیریت',
    path: '/konjed',
    err,
  });
};
const getRegisterStudent = (req, res, next) => {
  res.render('register', {
    titleText: 'ثبت نام',
    path: '/register',
    message: [],
  });
};

const getLogin = (req, res, next) => {
  let err = req.flash('error');

  res.render('login', {
    titleText: 'ورود',
    path: '/login',
    err,
  });
};

const handleLogin = async (req, res, next) => {
  let strategy;
  console.log(req.body.username);
  let user =
    (await Teacher.findOne({ email: req.body.username })) ||
    (await Student.findOne({ email: req.body.username }));
  console.log(user);
  if (user) {
    if (user.role === 'teacher') {
      strategy = 'teacher-local';
    } else {
      strategy = 'student-local';
    }
  }
  passport.authenticate(strategy, {
    failureFlash: true,
    failureRedirect: '/login',
    badRequestMessage: 'نام کاربری و رمز عبور را وارد کنید',
  })(req, res, next);
};
const rememberMe = (req, res, next) => {
  if (req.body.rememberme) {
    req.session.cookie.originalMaxAge = 60000 * 60 * 24; //24 hour
  } else {
    req.session.cookie.originalMaxAge = 60000 * 60; //60 minute
  }
  if (req.user.role === 'student') {
    res.redirect('/studash');
  } else if (req.user.role === 'teacher') {
    res.redirect('/teacherdash');
  }
};

const logout = (req, res, next) => {
  req.session.cookie.originalMaxAge = null;
  req.logout((err) => {
    if (err) return next(err);
  });
  res.redirect('/login');
};

const getCoursesU = async (req, res, next) => {
  let page = +req.query.page || 1;
  let coursePerPage = 6;
  try {
    let numberOfCourses = await Course.find().countDocuments();
    let courses = await Course.find()
      .skip((page - 1) * coursePerPage)
      .limit(coursePerPage);

    res.render('coursesU', {
      titleText: 'دوره ها',
      path: '/courses',
      courses,
      truncateTo200,
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: coursePerPage * page < numberOfCourses,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfCourses / coursePerPage),
    });
  } catch (error) {
    res.redirect('/');

    //todo error 500
  }
};

const getSingleCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req?.query?.courseId).populate(
      'teacher'
    );
    if (!course) res.redirect('/courses');
    res.render('course', {
      titleText: ' جزئیات دوره ',
      path: '/course',
      course,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/courses');
  }
};

const sendFile = (req, res, next) => {
  let fileName = req.query.fileName;
  let filepath = path.join(appRoot, 'public', 'files', fileName);
  // res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
  res.download(filepath, (err) => {
    if (err) console.log(err);
  });
};

const getTeachersU = async (req, res, next) => {
  let page = +req.query.page || 1;
  let teacherPerPage = 12;
  try {
    let numberOfTeachers = await Teacher.find().countDocuments();
    let teachers = await Teacher.find()
      .skip((page - 1) * teacherPerPage)
      .limit(teacherPerPage);
    teachers = teachers.reverse();
    res.render('teachersU', {
      titleText: 'اساتید',
      path: '/teachers',
      teachers,
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: teacherPerPage * page < numberOfTeachers,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfTeachers / teacherPerPage),
    });
  } catch (error) {
    res.redirect('/');
  }
};

const getBlogsU = async (req, res, next) => {
  let page = +req.query.page || 1;
  let blogPerPage = 6;
  try {
    let numberOfBlogs = await Blog.find().countDocuments();
    let blogs = await Blog.find({ status: 'public' })
      .skip((page - 1) * blogPerPage)
      .limit(blogPerPage);
    res.render('blogsU', {
      titleText: '  پست ها  ',
      path: '/blogs',
      blogs,
      truncateTo200,
      miladiToShamsi: require('../utils/jalali').miladiToShamsi,
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: blogPerPage * page < numberOfBlogs,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfBlogs / blogPerPage),
    });
  } catch (err) {
    console.log(err);
    //todo error 500
  }
};

const getSingleBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.query.blogId);
    if (!blog) res.redirect('/blogs');
    res.render('blog', {
      titleText: '  جزئیات پست  ',
      path: '/blog',
      blog,
      miladiToShamsi,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/blogs');
    // todo error 500
  }
};
module.exports = {
  getAdminLogin,
  getLogin,
  getRegisterStudent,
  handleLogin,
  rememberMe,
  getHome,
  getCoursesU,
  getSingleCourse,
  logout,
  sendFile,
  getTeachersU,
  getBlogsU,
  getSingleBlog,
};
