const mongoose = require('mongoose');

const CoordinateSchema = mongoose.model('Coordinates', new mongoose.Schema({
  coordinate: {
    type: String,
    required: true,
    length: 1,
    maxLength: 40
  }
}));

module.exports = CoordinateSchema;