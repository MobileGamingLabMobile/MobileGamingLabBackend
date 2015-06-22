
exports=module.exports={};


exports.findAllTriggersWithCondition=function(condition_id,callback){
Trigger.find({}).populate('conditions',null,{_id:condition_id}).exec(
function(err,trigger){
  var  list=[];
    for (i=0;i<trigger.length;i++){
	if(trigger[i].conditions.length>0){
	    list.push(trigger[i])
	}
    }   

    return callback(err,list);
}
);
}

searchActionsToCall=function(triggerID){
    actions=interactions.trigger[triggerID].actions();
    for(action in actions){
//	action.interact();
    }


};

