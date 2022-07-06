const moment = require('jalali-moment');

shamsiToMiladi = (date) => {
  return moment
    .from(date, 'fa', 'YYYY/MM/DD')
    .locale('en')
    .format('YYYY/MM/DD');
};

miladiToShamsi = (date) => {
  // return moment(date).locale("fa").format("jYYYY/jMMMM/jD");
  return moment(date).locale('fa').format('jD jMMMM jYYYY');
};

miladiToDigitShamsi = (date) => {
  return moment(date).locale('fa').format('YYYY-MM-DD');
};

module.exports = { shamsiToMiladi, miladiToShamsi, miladiToDigitShamsi };
