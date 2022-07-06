const router = require('express').Router();
const auth = require('../middlewares/auth');
const studentDashController = require('../controllers/studashcontroller');
const studentController = require('../controllers/studentcontroller');

router.get('', auth.autheticatedStudent, studentDashController.getStuDash);
router.get(
  '/courses',
  auth.autheticatedStudent,
  studentDashController.getCourses
);

router.get(
  '/exams',
  auth.autheticatedStudent,
  studentDashController.getStudentExams
);
router.get(
  '/exam',
  auth.autheticatedStudent,
  studentDashController.getExamQuestions
);

router.post(
  '/answerQuestion',
  auth.autheticatedStudent,
  studentController.answerTheQuestion
);

router.get(
  '/exammarks',
  auth.autheticatedStudent,
  studentDashController.getMarks
);
module.exports = { router };
