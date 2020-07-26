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
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const phone = req.body.phone;
  const message = req.body.message;
  const content = `name: ${
    fname + " " + lname
  } \n email: ${email} \n phone: ${phone} \n message: ${message} `;

  const mail = {
    from: fname,
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
