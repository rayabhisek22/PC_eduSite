const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config({ path: "./.env" });
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const app = express();

//Database config===================================
const url = process.env.MONGODB_URL;
const urlLocal = "mongodb://localhost:27017/PC";
mongoose.connect(
  urlLocal,
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

app.post("/student/complaint", (req, res) => {
  const complain = req.body.complaintBox;
  const to = req.body.reqEmail;
  let emailSendTo;
  if (to === "director") emailSendTo = "soureen.nits@gmail.com";
  if (to === "swTeam") emailSendTo = "darjun2610@gmail.com";
  if (to === "academics") emailSendTo = "abhinavptn2018@gmail.com";
  if (to === "technical") emailSendTo = "shivaom1907@gmail.com";
  const content = ` complain: ${complain} `;

  const mail = {
    from: "Student Pragati Classes",
    to: emailSendTo,
    subject: "New Message from Pragati Classes (Contact Form)",
    text: content,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log(err);
      res.json({
        msg: "fail",
      });
    } else {
      res.send("Complain successfully sent");
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
