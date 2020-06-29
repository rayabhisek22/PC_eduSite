var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/student/login");
});

var facultyRoutes = require("./Faculty/faculty");
var studentRoutes = require("./Student/student");
var adminRoutes = require("./Admin/admin");
router.use("/faculty", facultyRoutes);
router.use("/student", studentRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
