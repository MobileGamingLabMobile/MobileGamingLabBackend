// app/models/action.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var player = rquire('./player.js');
var item = rquire('./item.js');
var resource = rquire('./resource.js');
var group = rquire('./group.js');
var scene = rquire('./scene.js');
var quest = rquire('./quest.js');
var interaction = rquire('./interaction.js');

// define the schema for action model
var actionSchema = mongoose.Schema({

	timeAction				:{
		wait				:Boolean,
		countdown			:int,
		startTime			:Boolean,
		stopTime			:Boolean
	},

	progressAction			:{
		start 				:Boolean,
		unlock				:Boolean,
		finish				:Boolean,
		update				:Boolean,
		scene				:scene.id,
		quest				:quest.id,
		interaction			:interaction.id
	},

	objectAction			:{
		add 				:int,
		resource			:resource.id,
		decreaseResource	:int,
		item 				:item.id,
		addItem				:Boolean,
		player 				:player.id,
		removeItem			:Boolean,
		placeItemOnMap		:Boolean
	},

	groupAction				:{
		group 				:group.id,
		showPlayers			:group.member,
		setVisibility		:Boolean
	}//,

	//inputAction				:{

	//}

});

// methods ======================
// create the model for action
module.exports = mongoose.model('Action', actionSchema);