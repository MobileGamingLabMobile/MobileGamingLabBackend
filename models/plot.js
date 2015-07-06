// app/models/plot.js
var user = require('./user.js');

var quest = require('./quest.js');

// define the schema for our plot model
var plotSchema = mongoose.Schema({
	quests	:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Quest'
	}] //one quest leads to the next one
});

// methods ======================
// create the model for plot
module.exports = mongoose.model('Plot', plotSchema);