// app/models/item.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var functions = rquire('./functions.js');

// define the schema for item model
var itemSchema = mongoose.Schema({

	functions		:[functions.id],
	name			:String,
	position		:[double, double],
	icon			:String

});

// methods ======================
// create the model for item
module.exports = mongoose.model('Item', itemSchema);