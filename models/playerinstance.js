// app/models/player.js
var item = require('./item.js');
var role = require('./role.js');
var group = require('./group.js');
var resource = require('./resource.js');
var properties = require('./properties.js');
var User = require("./user");
var Quest = require("./quest");
var GameSession = require("./gamesession");
var deepPopulate = require("mongoose-deep-populate");


// define the schema for player model
var playerInstanceSchema = mongoose.Schema({
	gameSession: {
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'GameSession'
	},
	inventar		:{
		enabled		:{
			type:Boolean,
			default: true
		},
		slot	:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Item'
		}]
	},
	activeQuest: {
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Quest'
	},
	availableQuests: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Quest'
	}],
	finishedQuests: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Quest'
	}],

	role			:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Role'
	}],

	position		:{
		x:Number, //GPS postion
		y: Number,
		z: Number 
	},
	resource		:[{
		value		: Number,
		type		: {
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Resource'
		}
	}],
	groups			:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Group'
	}],
	properties		: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'ObjectProperty'
	}],
	user		: {
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

// methods ======================
playerInstanceSchema.plugin(deepPopulate);

// create the model for player
module.exports = mongoose.model('PlayerInstance', playerInstanceSchema);