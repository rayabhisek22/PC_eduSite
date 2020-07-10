const express = require('express'); 
const router = express.Router(); 
const Auth = require('./auth'); 
const Faculty = require('../../models/Faculty');
const Student = require('../../models/Student'); 
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
router.use(Auth);
const isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/admin/login");
  }


const isAdmin = (req, res, next) => {
    if (req.user.admin_id) {
        return next(); 
    }
    res.redirect("/admin/login"); 
}




router.get('/students', isLoggedIn, isAdmin,  (req, res) => {
    Student.find({}, (err,data)=>{
        if (err)
        {
            console.log(err); 
            return; 
        }
       
        res.render('./Admin/studentList', { title:"Students List", people : data });

    }); 
}); 


router.get('/faculty',  isLoggedIn, isAdmin, (req, res) => {
    Faculty.find({}, (err,data)=>{
        if (err)
        {
            console.log(err); 
            return; 
        }
       
        res.render('./Admin/facultyList', { title:"Faculty List", people : data });

    }); 
}); 



router.get('/faculty/add',  isLoggedIn, isAdmin, (req, res) => {
    res.render('./Admin/addFaculty'); 
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
                        res.redirect('/admin/faculty'); 
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
        res.render('./Admin/oneFaculty', { person:person });
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
        res.redirect('/admin/faculty/');
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



router.get("/students/add", isLoggedIn, isAdmin, (req, res)=>{
    res.render('./Admin/addStudent'); 
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
                        res.redirect('/admin/students'); 
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
        res.render('./Admin/oneStudent', { person:person });
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
        res.redirect('/admin/students/');
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



module.exports = router; 