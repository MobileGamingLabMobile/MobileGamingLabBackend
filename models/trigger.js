// app/models/trigger.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var condition = rquire('./condition.js');

// define the schema for trigger model
var triggerSchema = mongoose.Schema({

	condition	:[condition.id],
	triggered	:Boolean
	
});

// methods ======================
// create the model for trigger
module.exports = mongoose.model('Trigger', triggerSchema);