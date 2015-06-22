
exports=module.exports={};

exports.testTriggerIfFullfilled=function(trigger, condition_id){

};


searchActionsToCall=function(triggerID){
    actions=interactions.trigger[triggerID].actions();
    for(action in actions){
//	action.interact();
    }


};

setConditionFulfilledToTriggers=function(triggers,condition_id){
    for(trigger in triggers){
	setConditionFulfilledToTrigger(trigger,condition_id);
    }
};
