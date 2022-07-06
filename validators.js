const fetch = require('node-fetch');

const validators = require('../models/secure/validators');
const fileValidators = require('../models/secure/filevalidators');
const { Teacher } = require('../models/Teacher');
const { Course } = require('../models/Course');
const { Exam } = require('../models/Exam');
const { Blog } = require('../models/Blog');

const captchaResponse = async (req, res, next) => {
  const token = req.body['g-recaptcha-response'];
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${token}&remoteip=${req.connection.remoteAddress}`;
  const response = await fetch(verifyUrl);
  let cpatchaStatus = await response.json();
  if (cpatchaStatus.success) {
    return next();
  } else {
    req.flash('error', 'اعتبار سنجی کپچا نا معتبر');
    res.redirect(req.url);
  }
};

const registerStudentValidator = async (req, res, next) => {
  try {
    await validators.studentValidatorSchema.validate(req.body, {
      abortEarly: false,
    });
    return next();
  } catch (err) {
    console.log(err.errors);
    return res.render('register', {
      titleText: 'ثبت نام',
      path: '/register',
      err: err.errors,
    });
  }
};

const teacherImageValidator = async (req, res, next) => {
  const teacher = await Teacher.findById(req?.query?.teacherId);
  try {
    if (req.files) {
      await fileValidators.blogImageSchema.validate(req.files.image, {
        abortEarly: false,
      });
      return next();
    } else {
      if (!teacher) {
        res.render('add-teacher', {
          titleText: 'مدیریت || استاد جدید',
          path: '/dashboard/add-teacher',
          layout: './layouts/dashlayout.ejs',
          user: req.user,
          err: ['عکس انتخاب کنید'],
        });
      } else {
        res.render('edit-teacher', {
          titleText: 'مدیریت || ویرایش استاد',
          path: '/dashboard/edit-teacher',
          layout: './layouts/dashlayout.ejs',
          user: req.user,
          err: ['عکس انتخاب کنید'],
          teacher,
        });
      }
    }
  } catch (err) {
    console.log(err);
    if (!teacher) {
      res.render('add-teacher', {
        titleText: 'مدیریت || استاد جدید',
        path: '/dashboard/add-teacher',
        layout: './layouts/dashlayout.ejs',
        user: req.user,
        err: err.errors,
      });
    } else {
      res.render('edit-teacher', {
        titleText: 'مدیریت || ویرایش استاد',
        path: '/dashboard/edit-teacher',
        layout: './layouts/dashlayout.ejs',
        user: req.user,
        err: err.errors,
        teacher,
      });
    }
  }
};

const addTeacherValidator = async (req, res, next) => {
  try {
    await validators.teacherValidatorSchema.validate(req.body, {
      abortEarly: false,
    });
    return next();
  } catch (err) {
    console.log(err);
    res.render('add-teacher', {
      titleText: 'مدیریت || استاد جدید',
      path: '/dashboard/add-teacher',
      layout: './layouts/dashlayout.ejs',
      user: req.user,
      err: err.errors,
    });
  }
};

const addCourseValidator = async (req, res, next) => {
  let course = await Course.findById(req?.query?.courseId);
  try {
    await validators.courseValidatorSchema.validate(req.body, {
      abortEarly: false,
    });
    return next();
  } catch (err) {
    console.log(err.errors);
    const teachers = await Teacher.find();
    if (!course) {
      res.render('add-course', {
        titleText: 'داشبورد || ایجاد کلاس',
        path: '/dashboard/add-course',
        layout: './layouts/dashlayout.ejs',
        user: req.user,
        err: err.errors,
        teachers,
      });
    } else {
      res.render('edit-course', {
        titleText: 'داشبورد || ویرایش کلاس',
        path: '/dashboard/edit-course',
        layout: './layouts/dashlayout.ejs',
        user: req.user,
        err: err.errors,
        teachers,
        course,
      });
    }
  }
};

const courseFileValidator = async (req, res, next) => {
  let courses;
  try {
    if (req.body.course === 'null') {
      console.log('oomad to if');
      courses = await Course.find();
      res.render('coursefile', {
        titleText: 'استاد || فایل ',
        path: '/teacherdash/coursefile',
        layout: './layouts/dashlayout.ejs',
        teacher: req.user,
        err: ['دوره را انتخاب کنید'],
        courses,
      });
    }
    await fileValidators.courseFileSchema.validate(req.files.file, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    courses = await Course.find();
    res.render('coursefile', {
      titleText: 'استاد || فایل ',
      path: '/teacherdash/coursefile',
      layout: './layouts/dashlayout.ejs',
      teacher: req.user,
      err: error.errors,
      courses,
    });
  }
};

const examValidator = async (req, res, next) => {
  try {
    await validators.examValidatorSchema.validate(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    let courses = await Course.find();
    res.render('createexam', {
      titleText: 'استاد || آزمون جدید ',
      path: '/teacherdash/createxam',
      layout: './layouts/dashlayout.ejs',
      teacher: req.user,
      err: err.errors,
      courses,
    });
  }
};

const questionValidator = async (req, res, next) => {
  try {
    await validators.questionValidatorSchema.validate(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    console.log(err);
    let exams = await Exam.find();
    res.render('addquestion', {
      titleText: 'استاد || اضافه کردن سوال ',
      path: '/teacherdash/addquestion',
      layout: './layouts/dashlayout.ejs',
      teacher: req.user,
      err: err.errors,
      exams,
    });
  }
};

const answerValidator = async (req, res, next) => {
  try {
    await validators.answerValidatorSchema.validate(req.body, {
      abortEarly: false,
    });
  } catch (err) {
    console.log(err);
  }
};

const addBlogImageValidator = async (req, res, next) => {
  let blog = await Blog.findById(req?.query?.blogId);
  try {
    if (req.files) {
      await fileValidators.blogImageSchema.validate(req.files.image, {
        abortEarly: false,
      });
      next();
    } else {
      if (!blog) {
        res.render('add-blog', {
          titleText: 'داشبورد || پست جدید',
          path: '/dashboard/add-blog',
          layout: './layouts/dashlayout.ejs',
          user: req.user,
          err: ['عکس انتخاب نکردید'],
        });
      } else {
        res.render('edit-blog', {
          titleText: 'داشبورد || ویرایش پست',
          path: '/dashboard/edit-blog',
          layout: './layouts/dashlayout.ejs',
          user: req.user,
          err: ['عکس انتخاب نکردید'],
          blog,
        });
      }
    }
  } catch (err) {
    console.log(err);
    if (!blog) {
      res.render('add-blog', {
        titleText: 'داشبورد || پست جدید',
        path: '/dashboard/add-blog',
        layout: './layouts/dashlayout.ejs',
        user: req.user,
        err: err.errors,
      });
    } else {
      res.render('edit-blog', {
        titleText: 'داشبورد || ویرایش پست',
        path: '/dashboard/edit-blog',
        layout: './layouts/dashlayout.ejs',
        user: req.user,
        err: err.errors,
        blog,
      });
    }
  }
};

const addCourseImageValidator = async (req, res, next) => {
  let course = await Course.findById(req?.query?.courseId);
  let teachers = await Teacher.find();
  try {
    if (req.files) {
      await fileValidators.blogImageSchema.validate(req.files.image, {
        abortEarly: false,
      });
      next();
    } else {
      if (!course) {
        res.render('add-course', {
          titleText: 'داشبورد || دوره جدید',
          path: '/dashboard/add-course',
          layout: './layouts/dashlayout.ejs',
          user: req.user,
          teachers,
          err: ['عکس انتخاب نکردید'],
        });
      } else {
        res.render('edit-course', {
          titleText: 'داشبورد || ویرایش دوره',
          path: '/dashboard/edit-course',
          layout: './layouts/dashlayout.ejs',
          user: req.user,
          teachers,
          err: ['عکس انتخاب نکردید'],
          course,
        });
      }
    }
  } catch (err) {
    console.log(err);
    if (!course) {
      res.render('add-course', {
        titleText: 'داشبورد || دوره جدید',
        path: '/dashboard/add-course',
        layout: './layouts/dashlayout.ejs',
        user: req.user,
        teachers,
        err: err.errors,
      });
    } else {
      res.render('edit-course', {
        titleText: 'داشبورد || ویرایش دوره',
        path: '/dashboard/edit-course',
        layout: './layouts/dashlayout.ejs',
        user: req.user,
        teachers,
        err: err.errors,
        course,
      });
    }
  }
};

const addBlogValidator = async (req, res, next) => {
  let blog = await Blog.findById(req?.query?.blogId);
  try {
    await validators.blogValidatorSchema.validate(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    console.log(err);
    if (!blog) {
      res.render('add-blog', {
        titleText: 'داشبورد || پست جدید',
        path: '/dashboard/add-blog',
        layout: './layouts/dashlayout.ejs',
        user: req.user,
        err: err.errors,
      });
    } else {
      res.render('edit-blog', {
        titleText: 'داشبورد || ویرایش پست',
        path: '/dashboard/edit-blog',
        layout: './layouts/dashlayout.ejs',
        user: req.user,
        err: err.errors,
        blog,
      });
    }
  }
};

module.exports = {
  captchaResponse,
  registerStudentValidator,
  teacherImageValidator,
  addTeacherValidator,
  addCourseValidator,
  courseFileValidator,
  examValidator,
  questionValidator,
  answerValidator,
  addBlogImageValidator,
  addBlogValidator,
  addCourseImageValidator,
};
