const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Admin = require("../../models/Admin");
const SuperAdmin = require("../../models/SuperAdmin");
const session = require("express-session");
const bcrypt = require("bcryptjs");


const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/superadmin/login");
};

const isAdmin = (req, res, next) => {
  if (req.user.admin_id) {
    return next();
  }
  res.redirect("/superadmin/login");
};

const loggedInBlackout = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log("error");
    return next();
  }
  res.redirect("/superadmin/acc");
};

router.use(
  session({
    secret: "TheDarkKnight",
    resave: true,
    saveUninitialized: true,
  })
);

router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Wrong Password" });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.get("*", function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

router.get("/register", loggedInBlackout, (req, res) => {
  res.render("./SuperAdmin/register");
});

router.post("/register", (req, res) => {
  let newSuperAdmin = new SuperAdmin({
    name: req.body.name,
    email: req.body.email,
    contact: req.body.contact,
    designation: req.body.designation,
  });
  newSuperAdmin.save((err) => {
    if (err) {
      console.log(err);
      res.redirect("/superadmin/register");
      return;
    }
    let newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        newUser.password = hash;
        newUser.admin_id = newSuperAdmin._id;
        newUser.save((err) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("created");
          res.redirect("/superadmin/login");
        });
      });
    });
  });
});

router.get("/login", loggedInBlackout, (req, res) => {
  res.render("./SuperAdmin/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "acc",
    failureRedirect: "login",
  })
);

router.get("/acc", isLoggedIn, isAdmin, (req, res) => {
  res.render("./SuperAdmin/acc");
});

router.get("/logout", isLoggedIn, isAdmin, function (req, res) {
  req.logout();
  res.redirect("/Superadmin/login");
});

module.exports = router;
