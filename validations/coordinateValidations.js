const yup = require('yup');

const coordinateValidation = yup.object({
  coordinate: yup.string().matches('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}', "does not match the pattern!").required("Coordinate is required!")
});

module.exports = coordinateValidation;