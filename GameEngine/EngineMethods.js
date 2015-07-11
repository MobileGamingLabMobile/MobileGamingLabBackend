exports=module.exports={};

/**
 * Method to delegate the testing to the related condition object as defined under models.
 * 
 * @param values Data object as defined in the WebSocket API
 * @param type The type of the condition (should match condition.type) as a String 
 * @param client_key The client key generated at the registration on the socket
 * @param progress The progress-controller object to use socket and playerInstance
 */
testValues_Condition=function(values,type,client_key,progress){
    
    var logger=log4js.getLogger("testValues_Condition");
	logger.setLevel("ERROR");
    
    logger.trace('testValues_condition executed');
    //get the conditions of the active quest
    progress.getConditionsByType(type,function(conditionList){
	logger.debug("conditionList:"+conditionList);
	for(var i =0;i<conditionList.length;i++){
		//test each condition of active quest
	    conditionList[i].test(values,progress,function(bool,condition){
			logger.debug("condition fullfilled: "+bool+" condition: "+condition);
			if(bool){
				//find all trigger where this condition is linked
			    var triggerList=findAllTriggersWithCondition(condition._id,progress);
			    logger.debug("triggerList which have the conditions: "+triggerList);
			    
			    //for each trigger
			    for(var j =0;j<triggerList.length;j++){
					var trigger=triggerList[j];
					//check if all conditions are met
//					var finished=testAllConditionsFinished(trigger,progress);
					var finished = progress.isTriggerFinished(trigger._id); //if true internally it will be finished automatically
					logger.debug("testAllConditionsFinished: "+finished);
					if(finished){
						//if they are, then find the interactions where the trigger was used
					    var interactionList=progress.getInteractionsByTrigger(trigger._id);
					    logger.debug("InteractionList: "+interactionList);
					    
					    //for each interaction check if all trigger are fullfilled
					    for(var k =0;k<interactionList.length;k++){
							var interaction=interactionList[k];
							var allTriggered=testAllTriggers_Triggered(interaction,progress);
							if(allTriggered){
								logger.debug("interaction: "+interaction);
								interaction.interact(client_key,progress);
							}
					    }
					}
			    }
			}
	    });
	};

    });
}

exports.testValues_Condition=testValues_Condition;

testAllConditionsFinished=function(trigger,progress){
    var conditions=trigger.conditions;
    for (var i=0;i<conditions.length;i++){
		var finished=progress.isConditionFinished(conditions[i]._id);
		if (!finished) {
		    return false;
		}
    }
    progress.finishTrigger(trigger._id);
    return true;
}

testAllTriggers_Triggered=function(interaction,progress){
    var logger=log4js.getLogger("testValues_Condition");
	logger.setLevel("ERROR");
    
    logger.trace('testAllTriggers_Triggered executed');
    var interactionTrigger=interaction.trigger;
    logger.trace("interactionTrigger.length: "+interactionTrigger.length);
    for (var i=0;i<interactionTrigger.length;i++){
		var trigger=interactionTrigger[i];
		logger.trace("progress: "+progress);
		logger.trace("trigger._id: "+trigger._id);
		var finished=progress.isTriggerFinished(trigger._id);
		if(!finished){
		    return false;
		}
    }
    return true;

}

findAllTriggersWithCondition=function(condition_id,progress){
    var conditionID=condition_id.toString();
    var logger=log4js.getLogger("testValues_Condition");
    logger.setLevel("ERROR");
    
    logger.trace('findAllTriggersWithCondition executed');
    var triggerList= progress.getAllTriggers();
    logger.trace("triggerList:"+triggerList);
    var  list=[];
    for (var i=0;i<triggerList.length;i++){
		var trigger=triggerList[i];
		for (var j=0;j<trigger.conditions.length;j++){
		    logger.trace("trigger.conditions[j]._id: "+trigger.conditions[j]._id+", condition_id: "+condition_id);
		    var triggerConditionID=trigger.conditions[j]._id.toString();
		    if(triggerConditionID===conditionID){
				logger.trace("trigger.condition._id equals conditionID")
				list.push(trigger);
				break;
		    }
		}
    }   

    return list;

}

exports.findAllTriggersWithCondition=findAllTriggersWithCondition;


sendUpdatedData=function(client_key,channel,data){
    io.to(clients[client_key]).emit(channel,data);
}
exports.sendUpdatedData=sendUpdatedData;
