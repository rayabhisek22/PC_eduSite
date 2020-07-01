const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 


const Management = new Schema({
	
	name:String, 
	contact:String, 
	email :String, 
	role:String

}); 



module.exports = mongoose.model('Management', Management);