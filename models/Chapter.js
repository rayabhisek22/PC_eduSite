var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var Chapter = new Schema({
	
	chapter_id: String,
	chapter_name: String,
	notes: [{
		type: Schema.Types.ObjectId, ref: 'Notes'
	}],
	videos: [{
		type: Schema.Types.ObjectId, ref: 'Videos'
	}]
}); 



module.exports = mongoose.model('Chapter', Chapter);