const { Teacher } = require('../models/Teacher');
const { Course } = require('../models/Course');
const { Blog } = require('../models/Blog');

const getAdminDash = async (req, res, nexy) => {
  let teachers = await Teacher.find().limit(4);
  let courses = await Course.find()
    .sort([['createdAt', 'descending']])
    .limit(5);
  res.render('admindash', {
    titleText: 'مدیریت || داشبورد',
    path: '/dashboard',
    layout: './layouts/dashlayout.ejs',
    user: req.user,
    courses,
    teachers,
  });
};

const getAddTeacher = async (req, res, next) => {
  res.render('add-teacher', {
    titleText: 'مدیریت || استاد جدید',
    path: '/dashboard/add-teacher',
    layout: './layouts/dashlayout.ejs',
    user: req.user,
  });
};

const getTeachers = async (req, res, next) => {
  let page = req.query.page || 1;
  let teacherPerPage = 15;
  try {
    let numberOfTeachers = await Teacher.find().countDocuments();
    let teachers = await Teacher.find()
      .skip((page - 1) * teacherPerPage)
      .limit(teacherPerPage);
    res.render('teachers', {
      titleText: 'داشبورد || حذف و ویرایش اساتید',
      path: '/dashboard/teachers',
      layout: './layouts/dashlayout.ejs',
      user: req.user,
      teachers,
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: teacherPerPage * page < numberOfTeachers,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfTeachers / teacherPerPage),
    });
  } catch (err) {
    res.redirect('/');

    //todo error500
  }
};
const getEditTeacher = async (req, res, next) => {
  try {
    if (typeof req.query.teacherId !== 'undefined') {
      let teacher = await Teacher.findById(req.query.teacherId);
      res.render('edit-teacher', {
        titleText: 'داشبورد || ویرایش استاد',
        path: '/dashboard/edit-teacher',
        layout: './layouts/dashlayout.ejs',
        user: req.user,
        teacher,
      });
    } else {
      throw new Error();
    }
  } catch (err) {
    console.log(err);
    res.redirect('/dashboard/teachers');
  }
};

const getAddCourse = async (req, res, next) => {
  let teachers = await Teacher.find();
  res.render('add-course', {
    titleText: 'داشبورد || دوره جدید',
    path: '/dashboard/add-course',
    layout: './layouts/dashlayout.ejs',
    user: req.user,
    teachers,
  });
};

const getCourses = async (req, res, next) => {
  let page = req.query.page || 1;
  let coursePerPage = 15;
  try {
    let numberOfCourses = await Course.find().countDocuments();
    let courses = await Course.find()
      .skip((page - 1) * coursePerPage)
      .limit(coursePerPage)
      .populate(['teacher', 'student']);
    res.render('courses', {
      titleText: 'داشبورد || حذف و ویرایش دوره ها',
      path: '/dashboard/courses',
      layout: './layouts/dashlayout.ejs',
      user: req.user,
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
    //todo error500
    res.redirect('/');
  }
};

const getSpeceficCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.query.courseId).populate('student', [
      'firstname',
      'lastname',
    ]);
    res.render('coursestudents', {
      titleText: 'مدیر || زبان آموزان کلاس',
      path: '/dashboard/coursestudents',
      layout: './layouts/dashlayout.ejs',
      user: req.user,
      course,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const getEditCourse = async (req, res, next) => {
  try {
    if (typeof req.query !== 'undefined') {
      let course = await Course.findById(req.query.courseId);
      let teachers = await Teacher.find();

      res.render('edit-course', {
        titleText: 'داشبورد || ویرایش دوره',
        path: '/dashboard/edit-course',
        layout: './layouts/dashlayout.ejs',
        user: req.user,
        course,
        teachers,
      });
    } else {
      res.redirect('/dashboard/courses');
    }
  } catch (err) {
    console.log(err);
    //todo error500
    res.redirect('/');
  }
};
const getAddBlog = (req, res, next) => {
  res.render('add-blog', {
    titleText: 'داشبورد || پست جدید',
    path: '/dashboard/add-blog',
    layout: './layouts/dashlayout.ejs',
    user: req.user,
  });
};

const getBlogs = async (req, res, next) => {
  let page = req.query.page || 1;
  let blogPerPage = 15;
  try {
    let numberOfBlogs = await Blog.find().countDocuments();
    let blogs = await Blog.find()
      .sort([['createdAt', 'ascending']])
      .skip((page - 1) * blogPerPage)
      .limit(blogPerPage)
      .populate('createdBy');
    let { miladiToShamsi } = require('../utils/jalali');
    res.render('blogs', {
      titleText: 'داشبورد || پست ها',
      path: '/dashboard/blogs',
      layout: './layouts/dashlayout.ejs',
      user: req.user,
      blogs,
      miladiToShamsi,
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

const getEditBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.query.blogId);
    res.render('edit-blog', {
      titleText: 'داشبورد || ویرایش پست',
      path: '/dashboard/edit-blog',
      layout: './layouts/dashlayout.ejs',
      user: req.user,
      blog,
    });
  } catch (error) {}
};

module.exports = {
  getAdminDash,
  getAddTeacher,
  getAddCourse,
  getCourses,
  getEditCourse,
  getTeachers,
  getEditTeacher,
  getAddBlog,
  getBlogs,
  getEditBlog,
  getSpeceficCourse,
};
