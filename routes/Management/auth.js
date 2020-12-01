const express = require("express"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

const router = express.Router();
const User = require("../../models/User");
const Management = require("../../models/Management");

//PASSPORT CONFIGURATION===========
const session = require("express-session");
const bcrypt = require("bcryptjs");

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

//AUTH ROUTES===================
//login
router.get("/login", ifLoggedIn, (req, res) => {
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/management/acc",
    failureRedirect: "/management/login",
  }),
  (req, res) => {}
);

//logout
router.get("/logout", isLoggedIn, isManagement, function (req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/acc", isLoggedIn, isManagement, function (req, res) {
  Management.findOne({ _id: req.user.management_id }, (err, data) => {
    if (err) {
      return handleError(err);
    }
    res.render("./Management/acc", { user: data });
  });
});

function isManagement(req, res, next) {
  if (req.user.management_id) {
    return next();
  }
  res.redirect("/login");
}

//middleware for login
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function ifLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/management/acc");
}

module.exports = router;
