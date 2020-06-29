const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  contact: {
    type: Number,
  },
  email: {
    type: String,
    unique: true,
  },
  designation: String,
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
