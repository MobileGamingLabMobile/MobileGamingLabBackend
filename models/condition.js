// app/models/condition.js
var mongoose = require('mongoose');

var object = require('./object.js');
var item = require('./item.js');
var player = require('./player.js');
var group = require('./group.js');
var input = require('./input.js');
var role = require('./role.js');
var trigger = require('./trigger.js');

// define the schema for condition model
var conditionSchema = mongoose.Schema({

	name					:String,
	source 					:{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Object'
	},
	target: {
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Player'
	},
	available				:Boolean,

	timeCondition			:{
		countdown			:Number,
		beforeTime			:Date,
		betweenTime			:[Date, Date],
		afterTime			:Date
	},

	progressCondition		:{
		started				:Boolean,
		finished			:Boolean,
	},

	locationCondition		:{
		coord				:[Number, Number],
		minSpeed			:Number,
		minDistance			:Number,
		item				:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Item'
		}],
		player 				:{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Player'
		}
	},

	objectConditon			:{
		collected			:Boolean,
		activated			:Boolean,
		used				:Boolean,
		spent				:Boolean,
		amount				:Number,
	},

	groupCondition			:{
		formed				:Boolean,
		numberOfPlayers		:Number,
		groupID				:{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Group'
		}
	},

	inputCondition			:{
		value				: {
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Input'
		},
		validated			:Boolean,
		performed			:Boolean
	},

	playerCondition			:{
		player			:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Player'
		}],
		group				:{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Group'
		},
		role				:{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Role'
		},
		playsRole			:Boolean,
		roleAssigned		:Boolean,
		visibile			:Boolean
	},

	triggerCondition		:{
		trigger 			:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Trigger'
		}],
		relation			:String //fixed to AND OR XOR NOT
	}

});

// methods ======================
// create the model for condition
module.exports = mongoose.model('Condition', conditionSchema);