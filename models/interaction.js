// app/models/interaction.js
var mongoose = require('mongoose');

var trigger = require('./trigger.js');
var action = require('./action.js');

// define the schema for interaction model
var interactionSchema = mongoose.Schema({
	trigger		:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Trigger'
	}],
	actions	:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Action'
	}]
});

// methods ======================
// create the model for interaction
module.exports = mongoose.model('Interaction', interactionSchema);