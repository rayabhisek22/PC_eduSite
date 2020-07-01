
const express = require('express'), 
  passport = require('passport'),
  flash = require('connect-flash'),
    LocalStrategy = require('passport-local').Strategy;

const router = express.Router();
const User = require('../../models/User');
const Student = require('../../models/Student');

//PASSPORT CONFIGURATION===========
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

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


router.use(flash());
router.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//AUTH ROUTES===================
//login
router.get("/login", ifLoggedIn, (req,res)=>{
	res.render("login");
});
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/student/acc",
    failureRedirect: "/student/login", 
    failureFlash:true
	}),(req,res)=>{

});


//register


//logout
router.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
})


router.get("/acc", isLoggedIn, isStudent,  function(req, res){
      
       Student.findOne({_id:req.user.student_id}, (err, data) => {
                    if (err)
                     {
                       return handleError(err); 
                     }
                     res.render("./Student/acc", { user:data });
       }); 
        
        
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

function ifLoggedIn(req,res,next){
  if(!req.isAuthenticated()){
    return next(); 
  }
  res.redirect("/student/acc");
  
}




module.exports = router;
