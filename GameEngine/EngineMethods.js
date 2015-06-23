
exports=module.exports={};

exports.testValues_Condition=function(values){
    Condition.find({}).exec(function(err,conditionList){
	for(var i =0;i<conditionList.length;i++){
	    var exists=conditionList[i].test(values);
	    if(exists==true){
		findAllTriggersWithCondition(conditionList[i]._id,function(err,triggerList){
		    for(var j =0;j<triggerList.length;j++){
			triggerList[j].testConditionFalseExists(function(bool){
			    if(bool==false){
				findAllInteractionsWithTrigger(triggerList[j]._id,function(err,interactionList){
				    for(var k =0;k<interactionList.length;k++){
					interactionList[k].testTriggerFalseExists(function(err,bool){
					    if(bool==false){
						interactionList[k].interact();
					    }
					});
				    }
				});
			    }
			});
		    }
		});  
	    };
	};
    });

}



findAllTriggersWithCondition=function(condition_id,callback){
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
exports.findAllTriggersWithCondition=findAllTriggersWithCondition;


findAllInteractionsWithTrigger=function(trigger_id,callback){
    Interaction.find({}).populate('trigger',null,{_id:trigger_id}).exec(
	    function(err,interaction){
		var  list=[];
		for (i=0;i<interaction.length;i++){
		    if(interaction[i].trigger.length>0){
			list.push(interaction[i])
		    }
		}   
		return callback(err,list);
	    }
    );
    


};
exports.findAllInteractionsWithTrigger=findAllInteractionsWithTrigger;
