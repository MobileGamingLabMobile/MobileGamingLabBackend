//var websockets=require("../Websocket.js"); //websocket defined app.js so no longer needed
//var Condition = require("../models/condition");
exports=module.exports={};

testValues_Condition=function(values,type,client_key,progress){
    var Interaction = require("../models/interaction");
    
    var logger=log4js.getLogger("testValues_Condition");
    logger.trace('testValues_condition executed');
    //console.log(gameSession);
    progress.getConditions(type,function(conditionList){
	logger.debug("conditionList:"+conditionList);
	for(var i =0;i<conditionList.length;i++){
	    conditionList[i].test(values,progress,function(bool,condition){
		logger.debug("condition fullfilled: "+bool+" condition: "+condition);
		if(bool==true){
		    var triggerList=findAllTriggersWithCondition(condition._id,progress);
		    logger.debug("triggerList which have the conditions: "+triggerList);
		    for(var j =0;j<triggerList.length;j++){
			var trigger=triggerList[j];
			var finished=testAllConditionsFinished(trigger,progress);
			logger.debug("testAllConditionsFinished: "+finished);
			if(finished==true){
			    var interactionList=progress.getInteractionsByTrigger(trigger._id);
			    logger.debug("InteractionList: "+interactionList);
			    for(var k =0;k<interactionList.length;k++){
				var interaction=interactionList[k];
				var allTriggered=testAllTriggers_Triggered(interaction,progress);
				if(allTriggered){
					logger.debug("interaction: "+interaction);
					interaction.interact(client_key);
				 
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
	if(!finished){
	    return false;
	}
    }
    progress.finishTrigger(trigger._id);
    return true;
}

testAllTriggers_Triggered=function(interaction,progress){
    var logger=log4js.getLogger("testValues_Condition");
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
    console.log('clientkey:'+clients[client_key]+', channel'+channel)
    io.to(clients[client_key]).emit(channel,data);
}
exports.sendUpdatedData=sendUpdatedData;
