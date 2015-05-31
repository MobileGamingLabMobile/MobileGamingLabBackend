// app/models/questCollection.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var user = rquire('./user.js');

var quest = rquire('./quest.js');
var plot = rquire('./plot.js');

// define the schema for our questCollection model
var questCollectionSchema = mongoose.Schema({
	quests 	:[quest.id],
	plot	:[plot.id]
});

// methods ======================
// create the model for questCollection
module.exports = mongoose.model('QuestCollection', questCollectionSchema);