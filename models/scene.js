// app/models/scene.js
var user = require('./user.js');

var trigger = require('./trigger.js');
var questCollection = require('./questCollection.js');
var questEvent = require('./questEvent.js');

// define the schema for our scene model
var sceneSchema = mongoose.Schema({
	questCollection	: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'QuestCollection'
	}],
	trigger			: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Trigger'
	}],
	questEvent		: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'QuestEvent'
	}]
});

// methods ======================
// create the model for scene
module.exports = mongoose.model('Scene', sceneSchema);