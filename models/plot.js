// app/models/plot.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var user = rquire('./user.js');

var quest = rquire('./quest.js');

// define the schema for our plot model
var plotSchema = mongoose.Schema({
	quests	:[quest.id] //one quest leads to the next one
});

// methods ======================
// create the model for plot
module.exports = mongoose.model('Plot', plotSchema);