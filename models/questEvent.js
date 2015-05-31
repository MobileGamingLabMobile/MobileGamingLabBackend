// app/models/questEvent.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var functions = rquire('./functions.js');
var sequence = rquire('./sequence.js');

// define the schema for questEvent model
var questEventSchema = mongoose.Schema({
	functions	:[functions.id],
	sequence	:sequence.id
});

// methods ======================
// create the model for questEvent
module.exports = mongoose.model('QuestEvent', questEventSchema);