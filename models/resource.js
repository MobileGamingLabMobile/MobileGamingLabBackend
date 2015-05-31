// app/models/resource.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for resource model
var resourceSchema = mongoose.Schema({

	value		: int,
	name		: String,
	description	: String
	
});

// methods ======================
// create the model for object
module.exports = mongoose.model('Resource', resourceSchema);