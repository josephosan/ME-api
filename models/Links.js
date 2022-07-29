const mongoose = require('mongoose');

const LinksSchema = mongoose.model('Links', new mongoose.Schema({
  link: {
    type: String,
    required: true,
    length: 5,
    maxLength: 50
  }
}));

module.exports = LinksSchema;