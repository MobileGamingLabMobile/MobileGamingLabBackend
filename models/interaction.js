// app/models/interaction.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var trigger = rquire('./trigger.js');
var functions = rquire('./functions.js');

// define the schema for interaction model
var interactionSchema = mongoose.Schema({
	trigger		:[trigger.id],
	functions	:[functions.id]
});

// methods ======================
// create the model for interaction
module.exports = mongoose.model('Interaction', interactionSchema);