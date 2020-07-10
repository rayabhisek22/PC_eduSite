var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var Student = new Schema({
	
	name:String, 
	contact:String, 
	email :String, 
	father:String, 
	mother:String, 
	class: String,
	batch: String,
	subject: [{type: Schema.Types.ObjectId, ref: 'Subject'}]

}); 



module.exports = mongoose.model('Student', Student);