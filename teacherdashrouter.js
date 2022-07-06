const router = require('express').Router();
const auth = require('../middlewares/auth');
const validators = require('../middlewares/validators');
const teacherDashController = require('../controllers/teacherdashcontroller');
const teacherController = require('../controllers/teachercontroller');

router.get('', auth.autheticatedTeacher, teacherDashController.getTeacherDash);

router.get(
  '/courses',
  auth.autheticatedTeacher,
  teacherDashController.getTeacherCourses
);

router.get(
  '/coursestudents',
  auth.autheticatedTeacher,
  teacherDashController.getSpeceficCourse
);

router.get(
  '/coursefile',
  auth.autheticatedTeacher,
  teacherDashController.getCourseFile
);

router.post(
  '/coursefile',
  validators.courseFileValidator,
  teacherController.addFileToCourse
);

router.get(
  '/createexam',
  auth.autheticatedTeacher,
  teacherDashController.getCreateExam
);
router.get(
  '/addquestion',
  auth.autheticatedTeacher,
  teacherDashController.getAddQuestion
);

router.post(
  '/createexam',
  auth.autheticatedTeacher,
  validators.examValidator,
  teacherController.createExam
);
router.post(
  '/addquestion',
  auth.autheticatedTeacher,
  validators.questionValidator,
  teacherController.addQuestion
);
router.get(
  '/questionsandanswers',
  auth.autheticatedTeacher,
  teacherDashController.getQuestionAndAnswers
);

router.get(
  '/teacherexams',
  auth.autheticatedTeacher,
  teacherDashController.getTeacherExams
);

router.get(
  '/updatepassword',
  auth.autheticatedTeacher,
  teacherDashController.getUpdateTeacherPassword
);

router.post(
  '/updatepassword',
  auth.autheticatedTeacher,
  teacherController.updateTeacherPassword
);
router.post('/setmark', auth.autheticatedTeacher, teacherController.setMark);

module.exports = { router };
