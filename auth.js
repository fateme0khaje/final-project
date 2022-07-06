const autheticatedStudent = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'student') {
    return next();
  } else {
    res.redirect('/login');
  }
};

const autheticatedTeacher = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'teacher') {
    return next();
  } else {
    res.redirect('/login');
  }
};

const autheticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  } else {
    res.redirect('/');
  }
};

module.exports = {
  autheticatedStudent,
  autheticatedAdmin,
  autheticatedTeacher,
};
