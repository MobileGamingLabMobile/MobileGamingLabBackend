// app/models/item.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var functions = require('./functions.js');

// define the schema for item model
var itemSchema = mongoose.Schema({

	functions		:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'GameFunction'
	}],
	name			:String,
	position		:[Number, Number],
	icon			:String

});

// methods ======================
// create the model for item
module.exports = mongoose.model('Item', itemSchema);