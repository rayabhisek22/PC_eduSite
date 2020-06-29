const express = require("express");
const mongoose = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  admin_id: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
  },
  faculty_id: {
    type: Schema.Types.ObjectId,
    ref: "Faculty",
  },
  student_id: {
    type: Schema.Types.ObjectId,
    ref: "Student",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
