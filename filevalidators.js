const Yup = require('yup');

const studentImageSchema = Yup.object().shape({
  size: Yup.number().max(100000),
  mimetype: Yup.mixed().oneOf(['image/png', 'image/jpg', 'image/jpeg']),
});

const blogImageSchema = Yup.object().shape({
  size: Yup.number().max(3145728, 'سایز فایل باید کمتر از 3 مگابایت باشد'), //3 mb for each image
  mimetype: Yup.mixed().oneOf(
    ['image/jpeg', 'image/jpg'],
    'فرمت فایل باید JPG باشد'
  ),
});

const courseFileSchema = Yup.object().shape({
  size: Yup.number().max(50428800, 'حجم فایل شما بیشتر از 50 مگابایت است'),
  mimetype: Yup.mixed().oneOf(
    ['application/pdf'],
    'فرمت فایل شما باید .pdf باشد'
  ),
});
module.exports = { studentImageSchema, blogImageSchema, courseFileSchema };
