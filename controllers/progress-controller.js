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
	controller.id = Math.round(Math.random()*10000000);
	controller.conditions = [];
	controller.finishedConditions = [];
	controller.finishedTrigger = [];
	controller.activeQuest = null;
	
	//define methods
	controller.getID = function() {
		return this.id;
	}
	
	controller.setActiveQuest = function(questID) {
		Quest.findById(questID).deepPopulate("requirements.condition tasks.trigger tasks.actions", function(err, quest) {
			controller.activeQuest = quest;
		})
	}
	
	return controller;
};

module.exports = constructor;