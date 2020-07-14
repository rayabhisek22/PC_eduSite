const express = require('express'); 
const router = express.Router();

const Student = require('../../models/Student'); 
const Subject = require('../../models/Subject'); 
const Chapter = require('../../models/Chapter'); 
const Notes = require('../../models/Notes'); 
const Videos= require('../../models/Videos');
const Faculty = require('../../models/Faculty') 

const auth = require('./auth'); 
router.use(auth); 

const isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/student/login");
  }


const isStudent = (req, res, next) => {
    if (req.user.student_id) {
        return next(); 
    }
    res.redirect("/student/login"); 
}

router.get("/",(req,res)=>{
	res.redirect("/student/login")
})
router.get("/subject",isLoggedIn,isStudent,(req,res)=>{
	Student.findById(req.user.student_id)
			.populate("subject")
			.exec((err,student)=>{
				if(err) console.log(err)
				else{
					res.render("./Student/subject",{student:student})
				}				
			})
})

router.get("/subject/:sid",isLoggedIn,isStudent,(req,res)=>{
	Subject.findById(req.params.sid)
			.populate({ 
			     path: 'chapters',
			     populate: {
			       path: 'videos',
			       model: Videos
			     }			    
			  })
			.populate({ 
			     path: 'chapters',
			     populate:{
			     	path: 'notes',
			     	model: Notes
			     }
			  })
			.exec((err,subject)=>{
				if(err) console.log(err)
				else{
					console.log(subject.chapters[0].videos)
					res.render("./Student/mysubject",{subject:subject})
				}
			})
})

module.exports = router; 
