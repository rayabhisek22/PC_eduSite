var express = require('express'),
	mongoose = require('mongoose');


var Schema = mongoose.Schema;

var User = new Schema({
	username: String,
	password: String,
	admin_id: { type: Schema.Types.ObjectId, ref: 'Admin' }, 
	faculty_id: { type: Schema.Types.ObjectId, ref: 'Faculty' }, 
	student_id: { type: Schema.Types.ObjectId, ref: 'Student' }, 
	management_id: { type: Schema.Types.ObjectId, ref: 'Management' }, 
})

module.exports = mongoose.model("User", User); 