// app/models/questEvent.js
var mongoose = require('mongoose');
var functions = require('./functions.js');
var sequence = require('./sequence.js');

// define the schema for questEvent model
var questEventSchema = mongoose.Schema({
	functions	:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'GameFunction'
	}],
	sequence	: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Sequence'
	}]
});

// methods ======================
// create the model for questEvent
module.exports = mongoose.model('QuestEvent', questEventSchema);