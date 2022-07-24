const mongoose = require('mongoose');

const MetroLinesSchema = mongoose.model('metro-finder', new mongoose.Schema({
  line: {
    type: String
  },
  data: [{ name: String, coordinate: String }]
}));

module.exports = MetroLinesSchema;