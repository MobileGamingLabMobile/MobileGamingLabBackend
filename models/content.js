// app/models/content.js
var mongoose = require('mongoose');

// define the schema for content model
var contentSchema = mongoose.Schema({

	name		:String,
	url			:String, //oder auch input?
	type		:Buffer,
	html		: String

});

// methods ======================
// create the model for content
module.exports = mongoose.model('Content', contentSchema);