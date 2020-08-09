const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config({ path: "./.env" });
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
let no = 500;
const app = express();

//Database config===================================
const url = process.env.MONGODB_URL;
const urlLocal = "mongodb://localhost:27017/PC";
mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) console.log(err);
    else console.log("DB connected");
  }
);

//App config=======================================
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(express.json());

const transport = {
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

app.post("/email", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const subject = req.body.subject;
  const message = req.body.message;
  const content = `name: ${name}
 \n email: ${email} \n phone: ${phone} \n message: ${message} `;

  const mail = {
    from: name,
    to: process.env.EMAIL,
    subject: "New Message from Pragati Classes (Contact Form)",
    text: content,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: "fail",
      });
    } else {
      res.redirect("/");
    }
  });
});

app.post("/admission", (req, res) => {
  const name = req.body.name;
  const stream = req.body.stream;
  const Class = req.body.class;
  const college = req.body.college;
  const fatherName = req.body.fatherName;
  const motherName = req.body.motherName;
  const DOB = req.body.DOB;
  const age = req.body.age;
  const gender = req.body.gender;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const parentsNumber = req.body.parentsNumber;
  const address = req.body.address;
  const postalCode = req.body.postalCode;
  const content = `name: ${name}\n Stream: ${stream} \n Class: ${Class} \n College: ${college} \n fatherName: ${fatherName} \n motherName: ${motherName}: ${motherName} \n DOB: ${DOB} \n Age: ${age} \n Gender: ${gender} \n PhoneNumber: ${phoneNumber} \n ParentsNumber: ${parentsNumber} \n 
 Address: ${address} \n PostalCode: ${postalCode}\nemail: ${email} \n phone: ${phoneNumber} `;

  const mail = {
    from: name,
    to: process.env.EMAIL,
    subject: "New Submission of Admission Form",
    text: content,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: "fail",
      });
    } else {
      res.send(
        "Your registration form has been successfully submitted, We will contact you soon. You can contact on +91 8822341175 for any query"
      );
    }
  });
});

// app.post("/eventRegistration", (req, res) => {
//   const name = req.body.name;
//   const parentsname = req.body.parentsname;
//   const email = req.body.email;
//   const phone = req.body.phone;
//   const whatsapp = req.body.wa;

//   const content = `The registration details are: \n\n Name: ${name} \n Email: ${email} \n\n parentsname: ${parentsname} \nwhatsapp: ${whatsapp} \n phone: ${phone} \n Registration no: 20-A-1-${no} `;
//   const regN = `20-A-1-${no}`;
//   no = no + 1;
//   console.log(no);
//   const mail = {
//     from: name,
//     to: "eventspragati2020@gmail.com",
//     subject: "New Registration for Spardha",
//     text: content,
//   };

//   transporter.sendMail(mail, (err, data) => {
//     if (err) {
//       res.json({
//         msg: "fail",
//       });
//     } else {
//       res.render("reg", { name, parentsname, email, phone, whatsapp, regN });
//     }
//   });
// });

//Routes===========================================
app.use(express.static("public"));
var indexRoutes = require("./routes/index");

app.use(indexRoutes);

//Application listen at port 8080
var port = 5000 | process.env.PORT;
app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log("Server started at port " + port);
});
