//app/models/action.js
var player = require('./player.js');
var item = require('./item.js');
var resource = require('./resource.js');
var group = require('./group.js');
var scene = require('./scene.js');
var Quest = require('./quest.js');
var interaction = require('./interaction.js');
var game = require("./game");
var engineMethods = require("../GameEngine/EngineMethods");

//define the schema for action model
var actionSchema = mongoose.Schema({
	type : String,
	game : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Game'
	},
	timeAction : {
		wait : Boolean,
		countdown : Number,
		startTime : Boolean,
		stopTime : Boolean
	},

	progressAction : {
		start : Boolean,
		unlock : Boolean,
		finish : Boolean,
		update : Boolean,
		scene : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Scene'
		},
		quest : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Quest'
		},
		interaction : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Interaction'
		},
		game : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Game'
		}
	},

	objectAction : {
		add : Number,
		resource : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Resource'
		},
		decreaseResource : Number,
		item : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Item'
		},
		addItem : Boolean,
		player : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Player'
		},
		removeItem : Boolean,
		placeItemOnMap : Boolean
	},
	groupAction : {
		group : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Group'
		},
		showPlayers : [ {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Player'
		} ],
		setVisibility : Boolean
	}
// ,
// inputAction :{
// }
}, {
	toJSON : {
		minimize : false
	}
});
// methods ======================

actionSchema.methods.execute=function(client_key,progress,callback){
	var Quest = require("../models/quest");
    var logger=log4js.getLogger("models");
    logger.setLevel("ERROR");
    
    logger.trace('action.execute executed');
    logger.trace(this);
    switch(this.type) {
	    case "progressAction":
			if(this.progressAction.quest!=null){
			    var progressAction=this.progressAction;
			    var quest_id= progressAction.quest;
			    Quest.findById(quest_id).populate("description").exec(function(err,q){
						if(progressAction.unlock){
							progress.unlockQuest(q._id);
						}
						callback(err,q);
						logger.trace("Quest of ProgressAction: "+q);
						
						var result = {};
						result.operation = "available";
						result.quest = q;
						
						engineMethods.sendUpdatedData(client_key,"Quest",result);
				    });
			}
			break;
	    case "objectAction":
			var Item = require('./item.js');
			var objectAction=this.objectAction;
			var mapItem=this.objectAction.item; //the model uses the id as reference
			
			if(objectAction.placeItemOnMap){ //place on map
				//find item and return it
			    Item.findById(mapItem).exec(function(err,item){
					var engineMethods = require("../GameEngine/EngineMethods");
					var result = {};
					result.operation = "add";
					result.item = item;
					engineMethods.sendUpdatedData(client_key,"MapItem",result);
			    });
			} else if (objectAction.removeItem) { //remove from map
				var result = {};
				result.operation = "remove";
				result.item = mapItem;
				engineMethods.sendUpdatedData(client_key,"MapItem", result);
			}
			break;
	    default: throw ("the type "+this.type+" does not extists");
    }
};
//create the model for action
module.exports = mongoose.model('Action', actionSchema);
