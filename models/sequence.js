// app/models/sequence.js
var mongoose = require('mongoose');
var content  = require('./content.js');
var fun = require('./functions.js');

// define the schema for role model
var sequenceSchema = mongoose.Schema({
	content: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Content'
	}],
	functions: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'GameFunction'
	}]
});

// methods ======================
// create the model for role
module.exports = mongoose.model('Sequence', sequenceSchema);