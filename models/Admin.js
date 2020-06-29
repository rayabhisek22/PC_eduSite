const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
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
