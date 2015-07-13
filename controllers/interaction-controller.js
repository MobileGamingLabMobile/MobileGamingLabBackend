var Interaction = require("../models/interaction.js");
var Action = require("../models/action.js");
var Trigger = require("../models/trigger.js");
var Quest = require("../models/quest.js");

// create new interaction-controller
var interactionController = {}

// error handling message
error = function(res, message) {
	return res.json({
		success: false,
		message: message
	});
}

/*	NEWINTERACTION - methode
*	quest_id	   : quest.id the interaction should be related to
*	res            : response
*/
interactionController.newInteraction = function(quest_id, res) {
	// new interaction object
	var newInteraction = new Interaction();
	newInteraction.save();

	// save interaction to data base
	newInteraction.save(function(err, interaction) {
		// error response
		if (err) return res.json({
			success: false,
			message: "Can´t create new interaction in data base."
		});

		// connecting the interaction_id to the quest
		Quest.findById(quest_id, function(err, quest) {
			// pushing interaction_id to the interaction array of the quest
			quest.tasks.push(interaction._id);
			quest.save();
		});

		// success response with interaction object
		res.json({
			success: true,
			interaction: interaction,
			message: "New interaction successfully created."
		});
	});
}

/*	GETINTERACTION - methode
*	interaction_id : interaction.id
*	res            : response
*/
interactionController.getInteraction = function(interaction_id, res) {
	// finding interaction in data base
	Interaction.findById(interaction_id, function(err, interaction) {
		if (err) {
			// success response
			return res.json({
				success: false,
				message: "Not found."
			});
		}
		// success response with interaction object
		res.json({
			success: true,
			interaction: interaction,
			message: "Interaction successfully loaded."
		});
	});
}

/*	DELETEINTERACTION - methode
*	interaction_id : interaction.id of the interaction to delete
*	deep      : variable to clearify whether all references should be deleted too
*	quest_id   : quest.id the interaction is related to
*	res       : response
*/
interactionController.deleteInteraction = function(interaction_id, deep, quest_id, res) {
	// find interaction in data base and populate all its array attributes
	Interaction.findById(interaction_id).populate("trigger").populate("actions").exec(function(err, interaction){
		// error response if interaction is not found
		if (err) return error(res, "Problems finding interaction for delete operation.");
		if(!interaction) return error(res, "Can't find interaction to delete.");

		// if "deep" is "true" all references should be removed too
		if (deep) {
			//remove all linkin  to trigger
			for (var i=0; i<interaction.trigger.length; i++) {
				interaction.trigger[i].remove();
			}
			//remove all linkin  to actions
			for (var j=0; j<interaction.actions.length; j++) {		
				interaction.actions[j].remove();
			}
		}

		// finding quest the interaction is currently in and remove the interaction of the quest array (tasks) of the quest
		Quest.findByIdAndUpdate(quest_id, 
			{ $pull: { 'tasks' : interaction_id }}, function(err,quest){
				if(err){
					// error response
					return error(res, "Can´t remove interaction from list in game object.");
				}
				// remove function to remove the current interaction in data base
				interaction.remove(function(err) {
					// error response
					if (err) return error(res, "Error whiling removing interaction object.");
					// success response
					res.json({
						success: true,
						message: "Interaction successfully deleted."
					});	
				});
				// response of the quest object
				return res.json(quest);
			});
	});			
}

/*	ADDTRIGGER
*	interaction_id : interaction.id
*	trigger_id     : trigger.id to add to interaction
*	res            : response
*/
interactionController.addTrigger = function(interaction_id, trigger_id, res) {
	// finding interaction in data base
	Interaction.findById(interaction_id, function(err, interaction) {
		if (err) {
			// error response
			return res.json({
				success: false,
				message: "Not found."
			});
		}
		Trigger.findById(trigger_id, function(err, trigger) {
			if (err) {
				// error response
				return res.json({
					success: false,
					message: "Not found"
				});
			}
			interaction.trigger.push(trigger_id);
			interaction.save();
		});
		// success response
		res.json({
			success: true,
			message: "Trigger is added to interaction."
		});
	});
}

/*	ADDACTION (NOT YET TESTED)
*	interaction_id : interaction.id
*	action_id      : trigger.id to add to interaction
*	res            : response
*/
interactionController.addAction = function(interaction_id, action_id, res) {
	// finding interaction in data base
	Interaction.findById(interaction_id, function(err, interaction) {
		if (err) {
			// error response
			return res.json({
				success: false,
				message: "Not found."
			});
		}
		Action.findById(action_id, function(err, action) {
			if (err) {
				// error response
				return res.json({
					success: false,
					message: "Not found"
				});
			}
			interaction.action.push(action_id);
			interaction.save();
		});
		// success response
		res.json({
			success: true,
			message: "Action is added to interaction."
		});
	});
}

/* 	REMOVETRIGGER (NOT YET TESTED)
*	interaction_id
*	trigger_id
*	res
*/
interactionController.removeTrigger = function(interaction_id, trigger_id, res) {
	// finding interaction in data base and update
	// THE TRIGGER IS NOT REMOVED FROM DATA BASE!
	Interaction.findByIdAndUpdate(interaction_id, 
			{ $pull: { 'trigger' : trigger_id }}, function(err,interaction){
				if(err){
					// error response
					return error(res, "Can´t remove trigger from list in interaction object.");
				}	
			});
			// response of the interaction object
			return res.json(interaction);
}

/* 	REMOVEACTION (NOT YET TESTED)
*	interaction_id
*	action_id
*	res
*/
interactionController.removeAction = function(interaction_id, action_id, res) {
	// finding interaction_idaction in data base and update
	// THE ACTION IS NOT REMOVED FROM DATA BASE!
	Action.findByIdAndUpdate(action_id, 
			{ $pull: { 'actions' : action_id }}, function(err,action){
				if(err){
					// error response
					return error(res, "Can´t remove action from list in interaction object.");
				}	
			});
			// response of the interaction object
			return res.json(interaction);
}


module.exports = interactionController;