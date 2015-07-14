// app/models/game.js
var user = require('./user.js');

var quest = require('./quest.js');
var questCollection = require('./questCollection.js');
var scene = require('./scene.js');
var plot = require('./plot.js');
var action = require("./action.js");
var Role = require("./role.js");
var Player = require("./player.js");
var deepPopulate = require("mongoose-deep-populate");

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
		initialQuests: [{
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
		objects:[{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Object'
		}],
		items:[{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Item'
		}],
		resource:[{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Resource'
		}],
		boundary		:[Number, Number, Number, Number] //upper left corner, down right corner
	}

});

// methods ======================
// create the model for games and expose it to our app
gameSchema.plugin(deepPopulate);

gameSchema.pre("remove", function(next) {
	//roles
	for (var  i = 0; i < this.components.roles.length; i++) {
		var role = this.components.roles[i];
		role.remove();
	}
	//resource
	for (var  i = 0; i < this.components.resource.length; i++) {
		var resource = this.components.resource[i];
		resource.remove();
	}
	//items
	for (var  i = 0; i < this.components.items.length; i++) {
		var item = this.components.items;
		item.remove();
	}
	
	//player
	for (var j = 0; j < this.components.players.length; j++) {
		var player = this.components.players[j];
		player.remove();
	}
	
	//quests
	for (var  i = 0; i < this.components.quests.length; i++) {
		var quest = this.components.quests[i];
		quest.remove();
	}
	
	next();
})

module.exports = mongoose.model('Game', gameSchema);