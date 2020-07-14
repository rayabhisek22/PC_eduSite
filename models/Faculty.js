var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var Faculty = new Schema({	
	name:String, 
	contact:String, 
	email :String, 
	stars:Number, 
	notes: [{type: Schema.Types.ObjectId, ref: 'Notes'}],
	videos: [{type: Schema.Types.ObjectId, ref: 'Videos'}]
}); 



module.exports = mongoose.model('Faculty', Faculty);