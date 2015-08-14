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
    // fulfilled                               :Boolean,
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
		amount				:Number
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

//helper function
degree2meter = function (target_lon, target_lat, src_lon, src_lat) {
	var EARTH_RADIUS = 6371000; //in m
	var earth_perimeter = (2*Math.PI*EARTH_RADIUS);
	var degree_dist= Math.sqrt(Math.pow((target_lon-src_lon),2)+Math.pow((target_lat-src_lat),2));
	return (degree_dist/360 * earth_perimeter)
}

//methods ======================
conditionSchema.methods.test=function(values,progress,callback){
    var logger=log4js.getLogger("models");
    logger.trace('Condition.test executed');
    logger.trace('this'+this);
    var condition=this;
    switch(this.type) {
	    case "locationCondition"://auch mit Item machen
	    	//source coordinates
			var coord0= values.x;
			var coord1= values.y;
			
			//target coordinates
			var test_coord0, test_coord1;
			if(this.locationCondition.coord!=null){
			    test_coord0=this.locationCondition.coord[0];
			    test_coord1=this.locationCondition.coord[1];
			}else{
			    if (this.locationCondition.item!=null){
			    	test_coord0=this.locationCondition.item.position[0];
			    	test_coord1=this.locationCondition.item.position[1];
				} else{
			    	throw("No test coordinates exist in condition!");
			    }
			    
			}
			logger.trace(degree2meter(test_coord0, test_coord1, coord0, coord1) +"   "+this.locationCondition.buffer);
			if (degree2meter(test_coord0, test_coord1, coord0, coord1) <= this.locationCondition.buffer) {
			    logger.trace('condition');
			    logger.trace('location condition fullfilled ');
			  
			    var exists=progress.finishCondition(this._id);
			    callback(exists,condition);
			}
			else {
			    logger.trace('location condition not fullfilled ');
			    callback(false,null);
			}
			break;
	    default: throw ("the type "+this.type+" does not extists");
    }
};

//create the model for condition
module.exports = mongoose.model('Condition', conditionSchema);
