const express = require("express");
const router = express.Router();
const app = express();
const facultyRoutes = require("./Faculty/faculty");
const studentRoutes = require("./Student/student");
const adminRoutes = require("./Admin/admin");
const superAdminRoutes = require("./SuperAdmin/superadmin");
const managementRoutes = require("./Management/management");

// router.get("/", (req, res) => {
//   res.send("index.html");
// });

router.use("/faculty", facultyRoutes);
router.use("/student", studentRoutes);
router.use("/admin", adminRoutes);
router.use("/superadmin", superAdminRoutes);
router.use("/management", managementRoutes);
module.exports = router;
