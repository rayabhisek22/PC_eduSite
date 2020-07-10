var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var Subject = new Schema({
	
	name:String, 
	subject_id: String,
	chapters: [{
		type: Schema.Types.ObjectId, ref: 'Chapter' 
	}] 

}); 


module.exports = mongoose.model('Subject', Subject);