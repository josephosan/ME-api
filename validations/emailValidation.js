const yup = require('yup');

const emailValidation = yup.object({
  email: yup.string().email('Not a valid email').min(2).max(30).required('Email is required!')
});

module.exports = emailValidation;