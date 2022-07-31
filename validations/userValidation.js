const yup = require('yup');

const userValidation = yup.object({
  name: yup.string().min(2).max(20).required('Name is required!'),
  email: yup.string().email('Not a valid email').min(2).max(30).required('Email is required!')
});

module.exports = userValidation;