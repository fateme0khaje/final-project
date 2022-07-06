const passport = require('passport');
const sharp = require('sharp');
const shortId = require('shortid');

const path = require('path');
const appRoot = require('app-root-dir').get();
const { Admin } = require('../models/Admin');
const { Teacher } = require('../models/Teacher');
const { Course } = require('../models/Course');
const fs = require('fs');
const { Blog } = require('../models/Blog');

const adminLogin = async (req, res, next) => {
  passport.authenticate('admin-local', {
    failureFlash: true,
    failureRedirect: '/konjed',
    badRequestMessage: 'نام کاربری و رمز عبور را وارد کنید',
    // successRedirect: '/',
  })(req, res, next);
};

const rememberMe = (req, res, next) => {
  if (req.body.rememberme) {
    req.session.cookie.originalMaxAge = 60000 * 60 * 24; //24 hour
  } else {
    req.session.cookie.originalMaxAge = 60000 * 60; //60 minute
  }
  res.redirect('/dashboard');
};

const logout = (req, res, next) => {
  req.session.cookie.originalMaxAge = null;
  req.logout((err) => {
    if (err) return next(err);
  });
  res.redirect('/konjed');
};
const addTeacher = async (req, res, next) => {
  try {
    let imageName = `${shortId.generate()}_${req.files.image.name}`;
    let storagePath = path.join(
      appRoot,
      'public',
      'assets',
      'images',
      'teachers',
      imageName
    );
    await sharp(req.files.image.data)
      .jpeg()
      .resize(270, 270)
      .withMetadata()
      .toFile(storagePath)
      .catch((err) => {
        console.log(err);
        //todo error 500
      });
    await Teacher.create({ ...req.body, image: imageName });
    return res.redirect('/dashboard');
  } catch (err) {
    console.log(`erro : ${err}`);
    res.redirect('/');

    //todo error 500
  }
};

//@Desc edit teacher information on database
//1- get teacher by id and delete previous image of teacher from storage
//2- store new picture of teacher
//3- update teacher infromation in database
//4- redirect to teachers list page
const editTeacher = async (req, res, next) => {
  try {
    let teacher = await Teacher.findById(req.query.teacherId);
    fs.unlinkSync(
      path.join(
        appRoot,
        'public',
        'assets',
        'images',
        'teachers',
        teacher.image
      )
    );
    let imageName = `${shortId.generate()}_${req.files.image.name}`;
    let storagePath = path.join(
      appRoot,
      'public',
      'assets',
      'images',
      'teachers',
      imageName
    );
    await sharp(req.files.image.data)
      .jpeg()
      .resize(270, 270)
      .withMetadata()
      .toFile(storagePath)
      .catch((err) => {
        console.log(err);
        //todo error 500
      });
    await Teacher.updateOne(teacher, {
      $set: { ...req.body, image: imageName },
    });
    // await Teacher.findByIdAndUpdate(req.query.teacherId, {
    //   ...req.body,
    //   image: imageName,
    // });
    return res.redirect('/dashboard/teachers');
  } catch (err) {
    console.log(err);
    res.redirect('/');

    //todo error 500
  }
};

//@Desc get teacher ID with ajax
//1- delete teacher image from storage
//2- find record from database and remove it
//3- send response code
const deleteTeacher = async (req, res, next) => {
  try {
    let teacher = await Teacher.findById(req.body.id);
    let courses = await Course.find({ teacher: teacher._id });
    if (courses.length < 1) {
      fs.unlinkSync(
        path.join(
          appRoot,
          'public',
          'assets',
          'images',
          'teachers',
          teacher.image
        )
      );
      await Teacher.deleteOne(teacher);
      res.status(200).json({ message: 'deleted' });
    } else {
      res.status(403).json({ message: 'این معلم دوره فعال دارد' });
    }
  } catch (err) {
    console.log(err);
    res.redirect('/');

    //todo error 500
  }
};

//*end teacher operations Section

//*start Course operations Section
const addCourse = async (req, res, next) => {
  try {
    let imageName = `${shortId.generate()}_${req.files.image.name}`;
    let storagePath = path.join(
      appRoot,
      'public',
      'assets',
      'images',
      'courses',
      imageName
    );
    await sharp(req.files.image.data)
      .jpeg()
      .resize(2000, 1333, { fit: sharp.fit.contain, withoutEnlargement: false })
      .withMetadata()
      .toFile(storagePath)
      .catch((err) => {
        console.log(err);
        //todo error 500
      });

    await Course.create({
      ...req.body,
      image: imageName,
    });
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    res.redirect('/');

    //todo error 500
  }
};
//@Desc get course ID with ajax
//1- delete course image from storage
//2- find record from database and remove it
//3- send response code
const deleteCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.body.id);
    if (course.student.length < 1) {
      fs.unlinkSync(
        path.join(
          appRoot,
          'public',
          'assets',
          'images',
          'courses',
          course.image
        )
      );
      await Course.findByIdAndRemove(req.body.id);
      res.status(200).json({ message: 'deleted' });
    } else {
      res.status(403).json({ message: 'دوره مورد نظر دارای دانش اموز است' });
    }
  } catch (err) {
    console.log(err);
    res.redirect('/');

    //todo error 500
  }
};

//@Desc edit course information on database
//1- get course by id and delete previous image of course from storage
//2- store new picture of course
//3- update course infromation in database
//4- redirect to courses list page
const editCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.query.courseId);
    fs.unlinkSync(
      path.join(appRoot, 'public', 'assets', 'images', 'courses', course.image)
    );
    let imageName = `${shortId.generate()}_${req.files.image.name}`;
    let storagePath = path.join(
      appRoot,
      'public',
      'assets',
      'images',
      'courses',
      imageName
    );
    await sharp(req.files.image.data)
      .jpeg()
      .resize(2000, 1333, { fit: sharp.fit.contain, withoutEnlargement: false })
      .withMetadata()
      .toFile(storagePath)
      .catch((err) => {
        console.log(err);
        //todo error 500
      });
    await Course.findByIdAndUpdate(req.query.courseId, {
      ...req.body,
    });
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    res.redirect('/');

    //todo error 500
  }
};
//*end Course operations Section

//*start blog operations Section
const addBlog = async (req, res, next) => {
  try {
    let imageName = `${shortId.generate()}_${req.files.image.name}`;
    let storagePath = path.join(
      appRoot,
      'public',
      'assets',
      'images',
      'blogs',
      imageName
    );
    await sharp(req.files.image.data)
      .resize(749, 500, { fit: sharp.fit.contain, withoutEnlargement: false })
      .withMetadata()
      .jpeg()
      .toFile(storagePath)
      .catch((err) => {
        console.log(err);
        //todo error 500
      });
    await Blog.create({
      ...req.body,
      image: imageName,
      createdBy: req.user.id,
    });
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    // todo error 500
    // }
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.body.id);
    fs.unlinkSync(
      path.join(appRoot, 'public', 'assets', 'images', 'blogs', blog.image)
    );
    await Blog.deleteOne(blog);
    res.status(200).json({ message: 'deleted' });
  } catch (err) {
    console.log(err);
    //todo error 500
  }
};

const editBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.query.blogId);
    fs.unlinkSync(
      path.join(appRoot, 'public', 'assets', 'images', 'blogs', blog.image)
    );
    let imageName = `${shortId.generate()}_${req.files.image.name}`;
    let storagePath = path.join(
      appRoot,
      'public',
      'assets',
      'images',
      'blogs',
      imageName
    );
    await sharp(req.files.image.data)
      .resize(749, 500, { fit: sharp.fit.contain, withoutEnlargement: false })
      .withMetadata()
      .jpeg()
      .toFile(storagePath)
      .catch((err) => {
        console.log(err);
        //todo error 500
      });
    await Blog.findByIdAndUpdate(req.query.blogId, {
      ...req.body,
      image: imageName,
    });
    res.redirect('/dashboard/blogs');
  } catch (err) {
    console.log(err);
    // todo error 500
    // }
  }
};
//*end blog operations Section

module.exports = {
  adminLogin,
  rememberMe,
  logout,
  addTeacher,
  addCourse,
  editCourse,
  editTeacher,
  deleteTeacher,
  deleteCourse,
  addBlog,
  deleteBlog,
  editBlog,
};
