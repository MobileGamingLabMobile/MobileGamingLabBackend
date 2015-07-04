/*
 *	This class is used to handle the progress of a certain quest, since the general
 * 	quest progression is stored in the game session object and hence in the data base.
 *  The purpose for the progression controller is that after starting a certain quest
 *  the progress on conditions as part of the interaction needs to be stored.
 *  This will be done in memory, meaning that unless the quest was completed and the
 *  game is interrupted the propgression in one quest is lost. 
 */
function constructor () {
	var Quest = require("../models/quest");
	
	var controller = {};
	//define some attributes
	controller.conditions = [];
	controller.finishedConditions = [];
	controller.finishedTrigger = [];
	controller.activeQuest = null;
	controller.socket = null;
	
	//define methods
	
	controller.setSocket = function(s) {
		controller.socket = s;
	}
	
	controller.clear = function() {
		controller.conditions = [];
		controller.finishedConditions = [];
		controller.finishedTrigger = [];
		controller.activeQuest = null;
	}
	
	/**
	 * Searches for the specified quest in the database and populates all its conditions.
	 * @param questID The id of the quest that shall be activated.
	 */
	controller.setActiveQuest = function(questID) {
		controller.clear();
		Quest.findById(questID).deepPopulate("requirements.condition " +
				"tasks.trigger.conditions " +
				"tasks.actions").exec(function(err, quest) {
			controller.activeQuest = quest;
			//transfer the conditions to controller.conditions
			for (var i = 0; i < quest.tasks.length; i++) {
				var trigger = quest.tasks[i].trigger;
				for (var j=0; j < trigger.length; j++) {
					for (var k = 0; j < trigger[j].condition.length; k++) {
						controller.conditions.push(trigger[j].condition[k]._id);
					}
					
				}
			}
			
			controller.socket.emit("message",{
				success: true,
				message : "Quest successfully activated "+JSON.stringify(controller.getActiveQuest())
			});
		})
	}
	
	/**
	 * Checks if the condition exists for the active quest and marks it as finished if it does.
	 * @param conditionID The id of the condition object.
	 * @return Returns the success as boolean.
	 */
	controller.finishCondition = function(conditionID) {
		var position = controller.conditions.indexOf(conditionID);
		if (position >= 0) {
			var condition = controller.conditions.splice(position,1);
			controller.finishedConditions.push(condition);
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * finds the Trigger with the mentioned ID
	 * @param triggerID The id of the Trigger.
	 * @return Trigger object or null if not found.
	 */
	controller.getTrigger = function(triggerID) {
		for (var i = 0; i < controller.activeQuest.tasks.length; i++) {
			var task = controller.activeQuest.tasks[i];
			for (var j = 0; j < task.trigger.length; j++) {
				var trigger = task.trigger[j];
				if (trigger._id == triggerID) {
					return trigger;
				}
			}
		}
		return null;
	}
	
	/**
	 * Checks if trigger is available in the quest and if not already
	 * finished. This trigger will be marked as finished.
	 * @param triggerID The id of the Trigger that needs to be finished
	 * @return Returns the success as boolean.
	 */
	controller.finishTrigger = function(triggerID) {
		var trigger = controller.getTrigger(triggerID);
		if (trigger && controller.finishedTrigger.indexOf(triggerID) < 0) {
			controller.finishedTrigger.push(triggerID);
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Checks whether or not the trigger is finished. First by looking in the
	 * array. Then by checking the conditions. If the conditions are met, then
	 * the Trigger will be marked as triggered.
	 * @param triggerID
	 * @return boolean
	 */
	controller.isTriggerFinished = function(triggerID) {
		var trigger = controller.getTrigger(triggerID);
		if (trigger) {
			if (controller.finishedTrigger.indexOf(triggerID) >= 0) {
				return true;
			}
			for (var i = 0; i < trigger.conditions.length; i++) {
				var condition = trigger.conditions[i];
				if (controller.finishedConditions.indexOf(condition._id) < 0) return false;
			}
			controller.finishTrigger(triggerID);
			return true;
		}
		return false;
	}
	
	/**
	 * Return all finished trigger
	 */
	controller.getFinishedTrigger = function() {
		return controller.finishedTrigger;
	}
	
	/**
	 * Returns the all finished conditions
	 */
	controller.getFinishedConditions = function() {
		return controller.finishedConditions;
	}
	
	/**
	 * Checks whether or not the active quest is finished.
	 */
	controller.isQuestFinished = function() {
		return (controller.activeQuest.tasks.length == controller.finishedTrigger.length)
	}
	
	/**
	 * simply returns the active quest.
	 */
	controller.getActiveQuest = function() {
		return controller.activeQuest;
	}
	
	return controller;
};

module.exports = constructor;