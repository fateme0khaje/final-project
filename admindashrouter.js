const router = require('express').Router();
const adminController = require('../controllers/admincontroller');
const auth = require('../middlewares/auth');
const adminDashController = require('../controllers/admindashcontroller');
const validators = require('../middlewares/validators');

router.get('/logout', auth.autheticatedAdmin, adminController.logout);

router.get('', auth.autheticatedAdmin, adminDashController.getAdminDash);

router.get(
  '/add-teacher',
  auth.autheticatedAdmin,
  adminDashController.getAddTeacher
);

router.post(
  '/add-teacher',
  auth.autheticatedAdmin,
  validators.teacherImageValidator,
  validators.addTeacherValidator,
  adminController.addTeacher
);

router.get(
  '/add-course',
  auth.autheticatedAdmin,
  adminDashController.getAddCourse
);

router.post(
  '/add-course',
  auth.autheticatedAdmin,
  validators.addCourseImageValidator,
  validators.addCourseValidator,
  adminController.addCourse
);

router.get('/courses', auth.autheticatedAdmin, adminDashController.getCourses);
router.get(
  '/edit-course',
  auth.autheticatedAdmin,
  adminDashController.getEditCourse
);

router.post(
  '/edit-course',
  auth.autheticatedAdmin,
  validators.addCourseImageValidator,
  validators.addCourseValidator,
  adminController.editCourse
);

router.get(
  '/teachers',
  auth.autheticatedAdmin,
  adminDashController.getTeachers
);
router.get(
  '/edit-teacher',
  auth.autheticatedAdmin,
  adminDashController.getEditTeacher
);
router.post(
  '/edit-teacher',
  auth.autheticatedAdmin,
  validators.teacherImageValidator,
  adminController.editTeacher
);
router.post(
  '/delete-teacher',
  auth.autheticatedAdmin,
  adminController.deleteTeacher
);
router.post(
  '/delete-course',
  auth.autheticatedAdmin,
  adminController.deleteCourse
);

router.get('/add-blog', auth.autheticatedAdmin, adminDashController.getAddBlog);

router.post(
  '/add-blog',
  auth.autheticatedAdmin,
  validators.addBlogImageValidator,
  validators.addBlogValidator,
  adminController.addBlog
);
router.post('/delete-blog', auth.autheticatedAdmin, adminController.deleteBlog);

router.get('/blogs', auth.autheticatedAdmin, adminDashController.getBlogs);

router.get(
  '/edit-blog',
  auth.autheticatedAdmin,
  adminDashController.getEditBlog
);

router.post(
  '/edit-blog',
  auth.autheticatedAdmin,
  validators.addBlogImageValidator,
  validators.addBlogImageValidator,
  adminController.editBlog
);

router.get(
  '/coursestudents',
  auth.autheticatedAdmin,
  adminDashController.getSpeceficCourse
);
module.exports = { router };
