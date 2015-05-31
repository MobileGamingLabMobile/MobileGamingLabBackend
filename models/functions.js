// app/models/functions.js
var mongoose = require('mongoose');

var action = require('./action.js');

// define the schema for functions model
var functionsSchema = mongoose.Schema({
	action		:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Action'
	}]
});

// methods ======================
// create the model for functions
module.exports = mongoose.model('GameFunction', functionsSchema);