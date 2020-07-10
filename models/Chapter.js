var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var Chapter = new Schema({
	
	chapter_id: String,
	chapter_name: String,
	notes: [{
		link: String,
		title: String
	}],
	videos: [{
		link: String,
		title: String
	}]
}); 



module.exports = mongoose.model('Chapter', Chapter);