var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var Notes = new Schema({	
	title: String,
	link: String,
	faculty: String,
	facultyId: String,
	chapter: String,
	chapterId: String,
	subject: String,
	date: String
}); 



module.exports = mongoose.model('Notes', Notes);