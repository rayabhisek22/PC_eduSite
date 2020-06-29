const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  contact: {
    type: Number,
  },
  email: {
    type: String,
  },
  stars: Number,
});

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
