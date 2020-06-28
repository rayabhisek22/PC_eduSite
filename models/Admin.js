const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 


const Admin = new Schema({
	
	name:String, 
	contact:String, 
	email :String, 
	designation:String, 

}); 



module.exports = mongoose.model('Admin', Admin);