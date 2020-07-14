var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var Videos = new Schema({	
	title: String,
	link: String,
	faculty: String,
	facultyId: String,
	chapter: String,
	chapterId: String,
	subject: String,
	date: String
}); 



module.exports = mongoose.model('Videos', Videos);