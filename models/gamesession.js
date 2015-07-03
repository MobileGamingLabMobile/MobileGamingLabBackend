/**
 * The Game session data model. It is used to let the user play a game.
 */
var Game = require("./game");
var Quest = require("./quest");
var User = require("./user");
var PlayerInstance = require("./playerinstance");
var  Group = require("./group");
var Role = require("./role");
var deepPopulate = require("mongoose-deep-populate");

var gameSessionSchema = mongoose.Schema({
	started: Date,
	owner: {
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	game: {
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Game'
	},
	players: [{ //note: these are the instances of players not the schema kind defined in the editor (well they are created after those)
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'PlayerInstance'
	}],
	groups: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Group'
	}],
	roles: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Role'
	}]
});

// optional plugins
gameSessionSchema.plugin(deepPopulate,{
	populate: {
		"availableQuests": {
			select: "_id description"
		},
		"finishedQuests": {
			select: "_id description"
		},
		"activeQuest": {
			select: "_id description"
		}
	}
});

module.exports = mongoose.model('GameSession', gameSessionSchema);