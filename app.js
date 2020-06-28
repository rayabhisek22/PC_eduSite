var express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local');

var app = express();

//Database config===================================
var url = 'mongodb://localhost:27017/newdb';
mongoose.connect(url, {useNewUrlParser: true, useFindAndModify:false, useUnifiedTopology: true}, err=>{
	if(err) console.log(err);
	else
		console.log("connected");
});

//App config=======================================
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

//Routes===========================================
app.use(express.static('public'));
var indexRoutes = require('./routes/index');
app.use(indexRoutes);


//Application listen at port 8080
var port = 5000| process.env.PORT;
app.listen(port,(err)=>{
	if(err)
		console.log(err);
	else
		console.log("Server started at port 5000");
}) 
