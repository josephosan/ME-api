const yup = require('yup');

const linkValidation = yup.object({
  link: yup.string().min(5).max(50).required("Link is required!")
});

module.exports = linkValidation;