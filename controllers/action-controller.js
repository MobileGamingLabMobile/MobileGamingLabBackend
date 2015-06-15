var Action = require("../models/action");
var Game = require("../models/game");


var actionController = {}

error = function(res, message) {
	return res.json({
		success: false,
		message: message
	});
}

//helper functions
actionController.prepareOutput = function(action) {
	if (action instanceof Array) {
		arr = [];
		for (i in action) {
			arr.push(_trimAction(action[i].toJSON()));
		}
		return arr;
	}else {
		return _trimAction(action)
	}
}

_trimAction = function(action) {
	var copy = action;
	
	for (var key in copy) {
		if (key.indexOf("Action") > -1) {
			if (key != action.type) {
				delete copy[key];
			}
		}
	}
	return copy;
}

actionController.newAction = function(game_id,type,res) {
	var newAction = new Action();

	newAction.type = type;
	newAction.game = game_id;
	newAction.save(function(err, action){
		if (err) return error(res, "Can not create new action.");
		
		res.json({
			success: true,
			message: "Action was successfully created.",
			action: actionController.prepareOutput(action.toJSON())
		})
	});
}

actionController.getAction = function(action_id, res) {
	Action.findById(action_id, function(err, action) {
		if (err) return error(res, "Can't find action.");
		action = prepareOutput(action);
		res.json({
			success: true,
			message: "Action successfully fetched from data base.",
			action: action
		});
	});
}

actionController.modifyAction = function(action_id,object, res) {
	Action.findById(action_id, function(err, action) {
		actionType = object.type;
		if (!actionType) {
			return res.json({
				success: false,
				message: "Malformed input object \"type\" doesn't match."
			})
		}
		innerAction = object[actionType];
		
		if (action[actionType]) { //if there already is an object, then loop through and check for updates
			ct = action[actionType];
			//loop through the new object and write substitute changes
			for(key in innerAction) {
				if (!ct[key] && innerAction[key] && innerAction[key] != "") {
					ct[key] = innerAction[key];
				}
			}
		} else { //there is nothing then just add the object
			action[actionType] = innerAction;
		}
		action.save(function(err){
			if (err) return error(res, "Database problem while saving modifications on condition");
			
			res.json({
				success: true,
				message: "Condition successfully modified"
			});
		});
	});
}

actionController.deleteAction = function(aid,res) {
	Action.findById(aid).exec(function(err, action) {
		if (err || !action) error(res, "DB error or action was not found by ID: "+aid);
		
		action.remove(function(err){
			if (err) error(res, err);
			
			res.json({
				success: true,
				message: "Action with id "+aid+" successfully deleted"
			})
		})
	});
}

module.exports = actionController;