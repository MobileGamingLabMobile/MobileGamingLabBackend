// app/models/condition.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var object = rquire('./object.js');
var item = rquire('./item.js');
var player = rquire('./player.js');
var group = rquire('./group.js');
var input = rquire('./input.js');
var role = rquire('./role.js');
var trigger = rquire('./trigger.js');

// define the schema for condition model
var conditionSchema = mongoose.Schema({

	name					:String,
	object 					:object.id,
	available				:Boolean,

	timeCondition			:{
		countdown			:double,
		beforeTime			:Date,
		betweenTime			:[Date, Date],
		afterTime			:Date
	},

	progressCondition		:{
		started				:Boolean,
		finished			:Boolean,
	},

	locationCondition		:{
		coord				:[double, double],
		minSpeed			:double,
		minDistance			:double,
		item				:[item.id],
		player 				:player.id
	},

	objectConditon			:{
		collected			:Boolean,
		activated			:Boolean,
		used				:Boolean,
		spent				:Boolean,
		amount				:int,
	},

	groupCondition			:{
		formed				:Boolean,
		numberOfPlayers		:int,
		groupID				:group.id
	},

	inputCondition			:{
		value				:input.id,
		validated			:Boolean,
		performed			:Boolean
	},

	playerCondition			:{
		playerID			:[player.id],
		groupID				:group.id,
		roleID 				:role.id,
		playsRole			:Boolean,
		roleAssigned		:Boolean,
		visibile			:Boolean
	},

	triggerCondition		:{
		trigger 			:[trigger.id],
		relation			:String
	}

});

// methods ======================
// create the model for condition
module.exports = mongoose.model('Condition', conditionSchema);