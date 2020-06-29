const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  contact: {
    type: Number,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  fatherName: {
    type: String,
    trim: true,
  },
  motherName: {
    type: String,
    trim: true,
  },
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
