const router = require('express').Router();

//#internal modules and models
const mainController = require('../controllers/maincontroller');
const validators = require('../middlewares/validators');
const adminController = require('../controllers/admincontroller');
const studentController = require('../controllers/studentcontroller');

router.get('', mainController.getHome);
router.get('/konjed', mainController.getAdminLogin);

router.post(
  '/konjed',
  validators.captchaResponse,
  adminController.adminLogin,
  adminController.rememberMe
);

router.get('/register', mainController.getRegisterStudent);
router.post(
  '/register',
  validators.registerStudentValidator,
  studentController.registerStudent
);
router.get('/login', mainController.getLogin);
router.post(
  '/login',
  validators.captchaResponse,
  mainController.handleLogin,
  mainController.rememberMe
);

router.get('/logout', mainController.logout);

router.get('/courses', mainController.getCoursesU);

router.get('/course', mainController.getSingleCourse);

router.get('/enroll', studentController.registerOnCourse);

router.get('/file', mainController.sendFile);

router.get('/teachers', mainController.getTeachersU);

router.get('/blogs', mainController.getBlogsU);

router.get('/blog', mainController.getSingleBlog);
module.exports = { router };
