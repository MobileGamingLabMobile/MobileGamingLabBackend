// app/models/content.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for content model
var contentSchema = mongoose.Schema({

	name		:String,
	url			:String, //oder auch input?
	type		:Buffer

});

// methods ======================
// create the model for content
module.exports = mongoose.model('Content', contentSchema);