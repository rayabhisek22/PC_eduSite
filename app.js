const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const app = express();

//Database config===================================
const url =
  "mongodb+srv://pragati:pragati123@cluster0.fqhit.mongodb.net/PC?retryWrites=true&w=majority/";
// const urlLocal = "mongodb://localhost:27017/PC";
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

app.get("/notices", (req, res) => {
  res.render("notices");
});

//App config=======================================
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(express.json());

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
