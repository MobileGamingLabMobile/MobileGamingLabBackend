// app/models/action.js
var mongoose = require('mongoose');
var player = require('./player.js');
var item = require('./item.js');
var resource = require('./resource.js');
var group = require('./group.js');
var scene = require('./scene.js');
var quest = require('./quest.js');
var interaction = require('./interaction.js');
var game = require("./game");
var websockets=require("../Websocket.js");
// define the schema for action model
var actionSchema = mongoose.Schema({
	type: String,
	game: {
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Game'
	},
	timeAction				:{
		wait				:Boolean,
		countdown			:Number,
		startTime			:Boolean,
		stopTime			:Boolean
	},

	progressAction			:{
		start 				:Boolean,
		unlock				:Boolean,
		finish				:Boolean,
		update				:Boolean,
		scene				:{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Scene'
		},
		quest				:{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Quest'
		},
		interaction			:{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Interaction'
		},
		game: {
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Game'
		}
	},

	objectAction			:{
		add 				:Number,
		resource			:{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Resource'
		},
		decreaseResource	:Number,
		item 				:{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Item'
		},
		addItem				:Boolean,
		player 				:{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Player'
		},
		removeItem			:Boolean,
		placeItemOnMap		:Boolean
	},
	groupAction				:{
		group 				:{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Group'
		},
		showPlayers			:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Player'
		}],
		setVisibility		:Boolean
	}//,
	//inputAction				:{
	//}
}, {
    toJSON: {minimize: false}
});
//methods ======================

actionSchema.methods.execute=function(client_key,callback){
    switch(this.type) {
    case "progressAction":
	if(this.progressAction.quest!=null){
	    var progressAction=this.progressAction;
	    var quest_id=this.progressAction.quest;
	    Quest.find({'_id':quest_id}).exec(
		    function(err,quest){
			if(progressAction.start!=null){
			    quest[0].started=progressAction.start; 
			}
			if(progressAction.finish!=null){
			    quest[0].finish=progressAction.finish; 
			}
			if(progressAction.unlock!=null){
			    quest[0].available=progressAction.unlock; 
			}
			quest[0].save(function(){
                       // console.log('action executed');
     			callback(err,quest);
});
			//console.log(quest)
			//console.log('channel:'+channel['quest'])
			sendUpdatedData(client_key,channel['quest'],quest);

                       
		    });
	}
	break;
    default: throw ("the type "+this.type+" does not extists");
    }
};
// create the model for action
module.exports = mongoose.model('Action', actionSchema);