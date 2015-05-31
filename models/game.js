// app/models/game.js
var mongoose = require('mongoose');
var user = require('./user.js');

var quest = require('./quest.js');
var questCollection = require('./questCollection.js');
var scene = require('./scene.js');
var plot = require('./plot.js');

// define the schema for our game model
var gameSchema = mongoose.Schema({

	metadata			:{ // general information about the game and its published status
		name			: String, //nessasary to publish the game and be unique
		description		: String, //nessasary to publish the game
		category		: [String], //nessasary to publish the game, can be multiple
		owner			: {
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}, // set on creation of the game
		published		: Boolean, // only if its true the game can be found in the store
		publishedDate	: Date
	},

	components	:{ //game components
		quest			:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Quest'
		}],
		questCollection	:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'QuestCollection'
		}],
		scene			:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Scene'
		}],
		plot			:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Plot'
		}],

		boundary		:[Number, Number, Number, Number] //upper left corner, down right corner
	}

});

// methods ======================
// create the model for games and expose it to our app
module.exports = mongoose.model('Game', gameSchema);