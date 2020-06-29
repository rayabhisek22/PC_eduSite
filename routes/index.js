const express = require("express");
const router = express.Router();
const facultyRoutes = require("./Faculty/faculty");
const studentRoutes = require("./Student/student");
const adminRoutes = require("./Admin/admin");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.use("/faculty", facultyRoutes);
router.use("/student", studentRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
