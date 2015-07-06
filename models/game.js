// app/models/game.js
var user = require('./user.js');

var quest = require('./quest.js');
var questCollection = require('./questCollection.js');
var scene = require('./scene.js');
var plot = require('./plot.js');
var action = require("./action.js");
var Role = require("./role.js");
var Player = require("./player.js");

// define the schema for our game model
var gameSchema = mongoose.Schema({

	metadata			:{ // general information about the game and its published status
		name			: String, //necessary to publish the game and be unique
		description		: String, //necessary to publish the game
		category		: [String], //necessary to publish the game, can be multiple
		owner			: {
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}, // set on creation of the game
		published		: {
			type: Boolean, // only if its true the game can be found in the store
			default: false
		},
		publishedDate	: Date,
		comments: [{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}],
		rating: {
			type: Number,
			default: 0
		}
	},

	components	:{ //game components
		quests			:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Quest'
		}],
		questCollections	:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'QuestCollection'
		}],
		scenes			:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Scene'
		}],
		plots			:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Plot'
		}],
		roles: [{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Role'
		}],
		players: [{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Player'
		}],
		boundary		:[Number, Number, Number, Number] //upper left corner, down right corner
	}

});

// methods ======================
// create the model for games and expose it to our app
module.exports = mongoose.model('Game', gameSchema);