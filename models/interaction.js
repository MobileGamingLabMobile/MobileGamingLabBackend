// app/models/interaction.js
var mongoose = require('mongoose');

var trigger = require('./trigger.js');
var functions = require('./functions.js');

// define the schema for interaction model
var interactionSchema = mongoose.Schema({
	trigger		:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Trigger'
	}],
	functions	:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'GameFunction'
	}]
});

// methods ======================
// create the model for interaction
module.exports = mongoose.model('Interaction', interactionSchema);