// app/models/game.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var user = rquire('./user.js');

var quest = rquire('./quest.js');
var questCollection = rquire('./questCollection.js');
var scene = rquire('./scene.js');
var plot = rquire('./plot.js');

// define the schema for our game model
var gameSchema = mongoose.Schema({

	metadata			:{ // general information about the game and its published status
		name			: String, //nessasary to publish the game and be unique
		description		: String, //nessasary to publish the game
		category		: [String], //nessasary to publish the game, can be multiple
		owner			: user.id, // set on creation of the game
		published		: Boolean, // only if its true the game can be found in the store
		publishedDate	: Date
	},

	components	:{ //game components
		quest			:[quest.id],
		questCollection	:[questCollection.id],
		scene			:[scene.id],
		plot			:[plot.id],

		boundary		:[double, double, double, double] //upper left corner, down right corner
	}

});

// methods ======================
// create the model for games and expose it to our app
module.exports = mongoose.model('Game', gameSchema);