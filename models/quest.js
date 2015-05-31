// app/models/quest.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var trigger = rquire('./trigger.js');
var content = rquire('./content.js');
var interaction = rquire('./interaction.js');
var questEvent = rquire('./questEvent.js');

// define the schema for quest model
var questSchema = mongoose.Schema({
	requirements		:[trigger.id],
	questDiscription	:content.id, //wollten wir evtl als HTML realisieren
	tasks				:[interaction.id],
	questEvent			:questEvent.id,
	started				:Boolean,
	finished			:Boolean
});

// methods ======================
// create the model for quest
module.exports = mongoose.model('Quest', questSchema);