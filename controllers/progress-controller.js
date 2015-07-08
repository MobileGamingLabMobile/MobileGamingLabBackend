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
    var Condition = require("../models/condition");
    var controller = {};
    //define some attributes

    controller.conditions = [];
    controller.finishedConditions = [];
    controller.finishedTrigger = [];
    controller.activeQuest = null;
    controller.socket = null;
    controller.playerInstance = null;

    //define methods
    /**
     * @memberOf controller
     */
    controller.setSocket = function(s) {
	controller.socket = s;
    }

    /**
     * @memberOf controller
     */
    controller.setPlayerInstance = function(pi) {
	controller.playerInstance = pi;
    }
    /**
     * @memberOf controller
     */
    controller.clear = function() {
	controller.conditions = [];
	controller.finishedConditions = [];
	controller.finishedTrigger = [];
	controller.activeQuest = null;
    }

    /**
     * Searches for the specified quest in the database and populates all its conditions.
     * @param questID The id of the quest that shall be activated.
     * @memberOf controller
     */
    controller.setActiveQuest = function(questID) {
	controller.clear();
	Quest.findById(questID).deepPopulate("requirements.conditions " +
		"tasks.trigger.conditions " +
	"tasks.actions").exec(function(err, quest) {
	    controller.activeQuest = quest;
	    //transfer the conditions to controller.conditions
	    for (var i = 0; i < quest.tasks.length; i++) {
		var trigger = quest.tasks[i].trigger;
		for (var j=0; j < trigger.length; j++) {
		    for (var k = 0; k < trigger[j].conditions.length; k++) {
			controller.conditions.push(trigger[j].conditions[k]._id);
		    }	
		}
	    }
	    /*
			controller.socket.emit("message",{
				success: true,
				message : "Quest successfully activated "+JSON.stringify(controller.getActiveQuest())
			});
	     */
	    controller.socket.emit("message",{
		success: true,
		message : "Quest successfully activated "+JSON.stringify(controller.playerInstance)
	    });
	})
    }

    /**
     * Checks if the condition exists for the active quest and marks it as finished if it does.
     * @param conditionID The id of the condition object.
     * @return Returns the success as boolean.
     * @memberOf controller
     */
    controller.finishCondition = function(condition_id) {
	var conditionID=condition_id.toString();
	var logger=log4js.getLogger("progressController");
	logger.trace('Controller.finishCondition executed');
	logger.trace('conditionID: '+conditionID);
	logger.trace("controller.conditions:"+controller.conditions);
	var position = controller.conditions.toString().indexOf(conditionID);
	logger.trace("position"+position);

	if (position >= 0) {
	    logger.trace('position found--condition exists');
	    var condition = controller.conditions.splice(position,1);
	    controller.finishedConditions.push(condition);
	    return true;
	} else {
	    logger.trace('position not found--condition not exists');
	    return false;
	}
    }
    /**
     * Checks if the condition exists for the active quest and tests if it is finished.
     * @param conditionID The id of the condition object.
     * @return Returns the success as boolean.
     * @memberOf controller
     */
    controller.isConditionFinished = function(condition_id) {
	var logger=log4js.getLogger("progressController");
	logger.trace('Controller.isConditionFinished executed');
	var conditionID=condition_id.toString();

	var positionFinished = controller.finishedConditions.toString().indexOf(conditionID);
	logger.trace("finishedConditions: "+controller.finishedConditions);
	if (positionFinished >= 0) {
	    return true;
	}
	else{
	    return false;
	}
    }


    /**
     * finds the Trigger with the mentioned ID
     * @param triggerID The id of the Trigger.
     * @return Trigger object or null if not found.
     * @memberOf controller
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
     * get the interactions which have a specific trigger
     * @param triggerID The id of the Trigger.
     * @return Trigger object or null if not found.
     * @memberOf controller
     */
    controller.getInteractionsByTrigger = function(trigger_id) {
	var triggerID=trigger_id.toString();
	var list=[];
	for (var i = 0; i < controller.activeQuest.tasks.length; i++) {
	    var interaction = controller.activeQuest.tasks[i];
	    for (var j = 0; j < interaction.trigger.length; j++) {
		var trigger = interaction.trigger[j];
		if (trigger._id.toString() === triggerID) {
		    list.push(interaction);
		    break;
		}
	    }
	}
	return list;
    }

    /**
     * get all Triggers of the tasks of the activeQuest
     * @param triggerID The id of the Trigger.
     * @return Trigger object or null if not found.
     * @memberOf controller
     */
    controller.getAllTriggers = function() {
	var logger=log4js.getLogger("progressController");
	logger.trace('getAllTriggers executed');
	var list=[];
	for (var i = 0; i < controller.activeQuest.tasks.length; i++) {
	    var task = controller.activeQuest.tasks[i];
	    for (var j = 0; j < task.trigger.length; j++) {
		list.push(task.trigger[j]);

	    }
	}
	return list;
    }

    /**
     * Checks if trigger is available in the quest and if not already
     * finished. This trigger will be marked as finished.
     * @param triggerID The id of the Trigger that needs to be finished
     * @return Returns the success as boolean.
     * @memberOf controller
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
     * @memberOf controller
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
     * @memberOf controller
     */
    controller.getFinishedTrigger = function() {
	return controller.finishedTrigger;
    }

    /**
     * Returns the all finished conditions
     * @memberOf controller
     */
    controller.getFinishedConditions = function() {
	return controller.finishedConditions;
    }
    /**
     * Returns all conditions with a specific type
     * @memberOf controller
     */
    controller.getConditions = function(type,callback) {
	var logger=log4js.getLogger("progressController");
	logger.trace('getConditions executed');
	var conditions=controller.conditions;
	var list=[];
	logger.debug("conditions:"+conditions);
	pushCondition(list,conditions,0,type,function(list){
	    // logger.trace('conditionList: '+list)
	    return callback(list);  
	})



    }
    function pushCondition(list,conditions,i,type,callback){
	var logger=log4js.getLogger("progressController");
	logger.trace("condition._id: "+conditions[i]);
	Condition.find({_id:conditions[i]}).exec(function(err,condition){
	    if(condition){
		var condition=condition[0];
		logger.trace("condition types: typeCondition:"+condition.type+" typeCompare: "+type);
		if(condition.type==type){
		    logger.trace("condition found"+condition);
		    list.push(condition);
		}
	    }
	    if(i<(conditions.length-1)){
		return pushCondition(list,conditions,i+1,type,callback)
	    }
	    else{
		return callback(list);
	    }
	});
    }
    /**
     * Checks whether or not the active quest is finished.
     * @memberOf controller
     */
    controller.isQuestFinished = function() {
	//return (controller.activeQuest.tasks.length == controller.finishedTrigger.length);
	return true;
    }
    /**
     * @memberOf controller
     */
    controller.hasActiveQuest = function() {
	return (controller.activeQuest != null);
    }

    /**
     * Finishes the active quest.
     * @return boolean wether or not the quest has been finished.
     * @memberOf controller
     */
    controller.finishQuest = function() {
	if (controller.isQuestFinished()) {
	    var index = controller.playerInstance.availableQuests.indexOf(controller.activeQuest._id);
	    var activeQuestLink = controller.playerInstance.availableQuests.splice(index,1);
	    controller.playerInstance.finishedQuests.push(activeQuestLink);
	    controller.playerInstance.save(function(err) {
		if (!err) {
		    controller.socket.emit("message","Next Quest, please");
		}
	    })
	    controller.clear();
	} else {
	    return false;
	}
    }

    /**
     * simply returns the active quest.
     * @memberOf controller
     */
    controller.getActiveQuest = function() {
	return controller.activeQuest;
    }

    return controller;
};


module.exports = constructor;