//app/models/condition.js


var object = require('./object.js');
var item = require('./item.js');
var player = require('./player.js');
var group = require('./group.js');
var input = require('./input.js');
var role = require('./role.js');
var trigger = require('./trigger.js');



//define the schema for condition model
var conditionSchema = mongoose.Schema({

    name					:String,
    available				:Boolean,
    type: String,
    fulfilled                               :Boolean,
    timeCondition			:{
	countdown			:Number,
	beforeTime			:Date,
	betweenTime			:[Date, Date],
	afterTime			:Date
    },

    progressCondition		:{
	quest:	{
	    type:  mongoose.Schema.Types.ObjectId,
	    ref: 'Quest'
	},
	started				:Boolean,
	finished			:Boolean,
    },

    locationCondition		:{
	coord				:[Number, Number],
	minSpeed			:Number,
	minDistance			:Number,
	buffer                          :Number,
	item				:{
	    type:  mongoose.Schema.Types.ObjectId,
	    ref: 'Item'
	},
	player 				:{
	    type:  mongoose.Schema.Types.ObjectId,
	    ref: 'Player'
	}
    },

    objectConditon			:{
	object				:{
	    type:  mongoose.Schema.Types.ObjectId,
	    ref: 'Object'
	},
	player 				:{
	    type:  mongoose.Schema.Types.ObjectId,
	    ref: 'Player'
	},
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

//methods ======================
conditionSchema.methods.test=function(values){

    switch(this.type) {
    case "locationCondition":
	var coord0= values.coord[0];
	var coord1= values.coord[1];
	if(Math.abs(this.locationCondition.coord[0]-coord0)<=this.locationCondition.buffer&&Math.abs(this.locationCondition.coord[1]-   
		coord1)<=this.locationCondition.buffer){
	    this.setFulfilled(true);
	    return true;
	}
	return false;
	break;
    default: throw ("the type "+this.type+" does not extists");
    }
};
conditionSchema.methods.setFulfilled=function(bool) {
    this.fulfilled=bool;
}



//create the model for condition
module.exports = mongoose.model('Condition', conditionSchema);
