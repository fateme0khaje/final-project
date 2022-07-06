const passport = require('passport');
const { Strategy } = require('passport-local');
const bcrypt = require('bcryptjs');
const { Student } = require('../models/Student');
const { Admin } = require('../models/Admin');
const { Teacher } = require('../models/Teacher');

passport.use(
  'student-local',
  new Strategy(async (username, password, done) => {
    try {
      const user = await Student.findOne({ email: username });

      if (!user)
        return done(null, false, {
          message: 'نام کاربری وارد شده وجود ندارد',
        });
      let matchPass = await bcrypt.compare(password, user.password);
      if (matchPass) return done(null, user);
      return done(null, false, {
        message: 'نام کاربری یا رمز عبور اشتباه است',
      });
    } catch (err) {
      console.log(err);
      done(err);
    }
  })
);

passport.use(
  'teacher-local',
  new Strategy(async (username, password, done) => {
    try {
      const user = await Teacher.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: 'نام کاربری وارد شده وجود ندارد' });
      }
      let matchPass = await bcrypt.compare(password, user.password);
      if (matchPass) {
        return done(null, user);
      }
      return done(null, null, { message: 'نام کاربری یا گذرواژه اشتباه است' });
    } catch (err) {
      console.log(err);
      done(err);
    }
  })
);

passport.use(
  'admin-local',
  new Strategy(async (username, password, done) => {
    try {
      const admin = await Admin.findOne({ email: username });
      if (!admin) return done(null, false, { message: 'شما مدیر نیستید' });
      let matchPass = await bcrypt.compare(password, admin.password);
      if (matchPass) return done(null, admin);
      return done(null, false, {
        message: 'نام کاربری یا رمز عبور اشتباه است',
      });
    } catch (err) {
      console.log(err);
      done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  if (id.role === 'student') {
    Student.findById(id, (err, user) => {
      done(err, user);
    });
  } else if (id.role === 'admin') {
    Admin.findById(id, (err, user) => {
      done(err, user);
    });
  } else if (id.role === 'teacher') {
    Teacher.findById(id, (err, user) => {
      done(err, user);
    });
  } else {
    done('Error database', null);
  }
});
