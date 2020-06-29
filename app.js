const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const app = express();

//Database config===================================
const url = "mongodb://localhost:27017/PC";
mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) console.log(err);
    else console.log("DB connected");
  }
);

//App config=======================================
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//Routes===========================================
app.use(express.static("public"));
var indexRoutes = require("./routes/index");
app.use(indexRoutes);

//Application listen at port 8080
var port = 5000 | process.env.PORT;
app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log("Server started at port 5000");
});
