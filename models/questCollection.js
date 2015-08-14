// app/models/questCollection.js

var user = require('./user.js');

var quest = require('./quest.js');
var plot = require('./plot.js');

// define the schema for our questCollection model
var questCollectionSchema = mongoose.Schema({
	quests 	:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Quest'
	}],
	plot	:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Plot'
	}]
});

// methods ======================
// create the model for questCollection
module.exports = mongoose.model('QuestCollection', questCollectionSchema);