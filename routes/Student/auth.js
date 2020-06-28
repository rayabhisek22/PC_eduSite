
const express = require('express'), 
	passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var router = express.Router();
var User = require('../../models/User');
var Student = require('../../models/Student');

//PASSPORT CONFIGURATION===========
const session = require('express-session');
const bcrypt = require('bcryptjs');


router.use(session({
    secret: 'TheDarkKnight',
    resave: true,
    saveUninitialized: true
  }));
  
  router.use(passport.initialize());
  router.use(passport.session());
  
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err; 
            if (isMatch)
            {
                return done(null, user); 
            }
            else
            {
                return done(null, false, {message : 'Wrong Password'});
            }
        }); 
        
        
      });
    }
  ));
  
   passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
  
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
  
    router.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
  });



//AUTH ROUTES===================
//login
router.get("/login",(req,res)=>{
	res.render("./Student/login");
})
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/student/acc",
		failureRedirect: "/student/login"
	}),(req,res)=>{

})


//register


//logout
router.get("/logout",function(req,res){
  req.logout();
  res.redirect("/student/login");
})


router.get("/acc", isLoggedIn, isStudent,  function(req, res){
        res.render("./Student/acc");
});

function isStudent(req,res,next){
  if(req.user.student_id){
    return next();
  }
  res.redirect("/student/login");
}



//middleware for login
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/student/login");
}

module.exports = router;
