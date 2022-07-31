const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 2,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  }
});

const User = mongoose.model('Users', userSchema);

module.exports = User;