// app/models/trigger.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var condition = require('./condition.js');

// define the schema for trigger model
var triggerSchema = mongoose.Schema({

	condition	:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Condition'
	}],
	triggered	:Boolean
	
});

// methods ======================
// create the model for trigger
module.exports = mongoose.model('Trigger', triggerSchema);