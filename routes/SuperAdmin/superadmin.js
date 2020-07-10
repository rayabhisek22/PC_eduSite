const express = require('express'); 
const router = express.Router(); 
const Auth = require('./auth'); 
const Faculty = require('../../models/Faculty');
const Student = require('../../models/Student'); 
const Subject = require('../../models/Subject'); 
const Chapter = require('../../models/Chapter'); 
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
router.use(Auth);
const isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/superadmin/login");
  }


const isAdmin = (req, res, next) => {
    if (req.user.admin_id) {
        return next(); 
    }
    res.redirect("/superadmin/login"); 
}


router.get("/",isLoggedIn, isAdmin, (req,res)=>{
  res.redirect("/superadmin/acc")
})

router.get('/students', isLoggedIn, isAdmin,  (req, res) => {
    Student.find({}, (err,data)=>{
        if (err)
        {
            console.log(err); 
            return; 
        }
       
        res.render('./SuperAdmin/studentList', { title:"Students List", people : data });

    }); 
}); 


router.get('/faculty',  isLoggedIn, isAdmin, (req, res) => {
    Faculty.find({}, (err,data)=>{
        if (err)
        {
            console.log(err); 
            return; 
        }
       
        res.render('./SuperAdmin/facultyList', { title:"Faculty List", people : data });

    }); 
}); 

router.get('/subject', isLoggedIn, isAdmin,  (req, res) => {
    Subject.find({}, (err,data)=>{
        if (err)
        {
            console.log(err); 
            return; 
        }
       
        res.render('./SuperAdmin/subjectList', { title:"Subjects List", subject : data });

    }); 
}); 



router.get('/faculty/add',  isLoggedIn, isAdmin, (req, res) => {
    res.render('./SuperAdmin/addFaculty'); 
}); 

router.post("/faculty/add", (req, res)=>{
    let newFaculty = new Faculty({ name:req.body.name, email:req.body.email, contact:req.body.contact }); 
    newFaculty.save((err) => {
           if (err)
           {
               console.log(err); 
               return; 
           }
           else
           {
            let newUser = new User({username:req.body.username, password:req.body.password});
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    newUser.password = hash; 
                    newUser.faculty_id = newFaculty._id;
                    newUser.save((err)=>{
                        if (err)
                        {
                            console.log(err); 
                            return;
                        }
                        res.redirect('/superadmin/faculty'); 
                    }); 
                });
            });

           }
    }); 

}); 


router.get("/faculty/edit/:id",  isLoggedIn, isAdmin, (req, res) => {
    Faculty.findById(req.params.id, (err, person) => {
        if (err)
        {
            console.log(err); 
            return; 
        }
        res.render('./SuperAdmin/oneFaculty', { person:person });
    }); 
}); 


router.post("/faculty/edit/:id",  isLoggedIn, isAdmin,(req, res) => {
    let updatedFaculty = {}; 
    updatedFaculty.name = req.body.name; 
    updatedFaculty.email = req.body.email;
    updatedFaculty.contact = req.body.contact;
 
    Faculty.updateOne({_id:req.params.id}, updatedFaculty, (err) => {
        if (err)
        {
            console.log(err); 
            return; 
        }
        res.redirect('/superadmin/faculty/');
    });     

}); 

router.delete("/faculty/edit/:id", isLoggedIn, isAdmin, (req, res)=>{
    Faculty.deleteOne({_id : req.params.id},(err)=>{
      if (err)
      {
          console.log(err); 
          return; 
      }
      else
      {
          res.send('success');
      }
    } );
}); 


router.get('/subject/add',  isLoggedIn, isAdmin, (req, res) => {
    res.render('./SuperAdmin/addSubject'); 
}); 

router.post("/subject/add", (req, res)=>{
    let newSubejct = new Subject({ name:req.body.name, subject_id:req.body.subject_id }); 
    newSubejct.save((err) => {
       if (err)
       {
           console.log(err); 
           return; 
       }
       else
       {
          res.redirect('/superadmin/subject'); 
       }
    }); 

}); 


router.get("/subject/edit/:id",  isLoggedIn, isAdmin, (req, res) => {
    Subject.findById(req.params.id, (err, subject) => {
        if (err)
        {
            console.log(err); 
            return; 
        }
        res.render('./SuperAdmin/oneSubject', { subject:subject });
    }); 
}); 


router.post("/subject/edit/:id",  isLoggedIn, isAdmin,(req, res) => {
    let updatedSubject = {}; 
    updatedSubject.name = req.body.name; 
    updatedSubject.subject_id = req.body.subject_id;
 
    Subject.updateOne({_id:req.params.id}, updatedSubject, (err) => {
        if (err)
        {
            console.log(err); 
            return; 
        }
        console.log("Updated subject")
        res.redirect('/superadmin/subject/');
    });     

}); 

router.delete("/subject/edit/:id", isLoggedIn, isAdmin, (req, res)=>{
    Subject.deleteOne({_id : req.params.id},(err)=>{
      if (err)
      {
          console.log(err); 
          return; 
      }
      else
      {
          res.send('success');
      }
    } );
}); 



router.get("/students/add", isLoggedIn, isAdmin, (req, res)=>{
    res.render('./SuperAdmin/addStudent'); 
}); 

router.post("/students/add",  isLoggedIn, isAdmin,(req, res)=>{
    let newStudent = new Student({ name:req.body.name, email:req.body.email, contact:req.body.contact, father:req.body.father, mother:req.body.mother }); 
    newStudent.save((err) => {
           if (err)
           {
               console.log(err); 
               return; 
           }
           else
           {
            let newUser = new User({username:req.body.username, password:req.body.password});
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    newUser.password = hash; 
                    newUser.student_id = newStudent._id;
                    newUser.save((err)=>{
                        if (err)
                        {
                            console.log(err); 
                            return;
                        }
                        res.redirect('/superadmin/students'); 
                    }); 
                });
            });

           }
    }); 

}); 

router.get("/students/edit/:id", isLoggedIn, isAdmin, (req, res) => {
    Student.findById(req.params.id, (err, person) => {
        if (err)
        {
            console.log(err); 
            return; 
        }
        res.render('./SuperAdmin/oneStudent', { person:person });
    }); 
}); 

router.post("/students/edit/:id",  isLoggedIn, isAdmin,(req, res) => {
    let updatedStudent = {}; 
    updatedStudent.name = req.body.name; 
    updatedStudent.email = req.body.email;
    updatedStudent.contact = req.body.contact;
    updatedStudent.father = req.body.father;
    updatedStudent.mother = req.body.mother;
    Student.updateOne({_id:req.params.id}, updatedStudent, (err) => {
        if (err)
        {
            console.log(err); 
            return; 
        }
        res.redirect('/superadmin/students/');
    });     

}); 

router.delete("/students/edit/:id", isLoggedIn, isAdmin, (req, res)=>{
    Student.deleteOne({_id : req.params.id},(err)=>{
      if (err)
      {
          console.log(err); 
          return; 
      }
      else
      {
          res.send('success');
      }
    } );
}); 


/* Routes for adding chapters */

router.get("/subject/:id/chapters/edit",  isLoggedIn, isAdmin, (req, res) => {
    Subject.findById(req.params.id)
    .populate('chapters') 
    .exec((err, subject1)  => {
        if (err)
        {
            console.log(err); 
            return; 
        }
        //console.log(subject1)
        res.render('./SuperAdmin/oneSubjectChapters', { subject:subject1 });
    }); 
}); 


router.post("/subject/:sid/chapters/:cid/edit",  isLoggedIn, isAdmin,(req, res) => {
    let updatedChapter = {
      chapter_name: req.body.chapter_name,
      chapter_id: req.body.chapter_id
    }
    console.log(updatedChapter)

    Chapter.updateOne({_id:req.params.cid}, updatedChapter, (err,uChapter)=>{
      if(err) console.log(err)
      else{
        Subject.findById(req.params.sid,(err,subject)=>{
          var idx = subject.chapters.indexOf(req.params.cid)
          subject.chapters[idx] = uChapter

          subject.save((err,uSubject)=>{
            if(err) console.log(err)
            else{
              console.log(uSubject)
              res.status(200).send("Successful")
            }
          })
        })
      }
    })
}); 

router.post("/subject/:id/chapters/add",  isLoggedIn, isAdmin,(req, res) => {
    console.log(req.body)
    let newChapter = new Chapter({
      chapter_name: req.body.chapter_name,
      chapter_id: req.body.chapter_id
    })
    console.log("In addition function")
    console.log(req.body)

    newChapter.save((err,nChapter)=>{
      if(err) console.log(err)
      else{
        Subject.findById(req.params.id,(err,subject)=>{
          if(err) console.log(err)
          else{
            subject.chapters.push(nChapter)
            subject.save((err,nSubject)=>{
              if(err) console.log(err)
              else{
                console.log(nSubject)
                res.status(200).send("Successful")
              }
            })
          }
        })
      }
    })
}); 


router.delete("/subject/:sid/chapters/:cid",isLoggedIn, isAdmin, (req,res)=>{
  Subject.findById(req.params.sid,(err,subject)=>{
    if(err) console.log(err)
    else{
      console.log(req.params.cid)
      var idx = subject.chapters.indexOf(req.params.cid)
      console.log(idx)
      subject.chapters.splice(idx,1)

      subject.save((err,uSubject)=>{
        if(err) console.log(err)
        else{
           Chapter.deleteOne({_id : req.params.id},(err)=>{
            if (err)
            {
                console.log(err); 
                return; 
            }
            else
            {
                res.send('success');
            }
          });
        }
      })
    }
  })
})


module.exports = router; 