const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 


const SuperAdmin = new Schema({
	
	name:String, 
	contact:String, 
	email :String, 
	designation:String, 

}); 



module.exports = mongoose.model('SuperAdmin', SuperAdmin);