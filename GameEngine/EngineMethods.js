
exports=module.exports={};

exports.testValues_Condition=function(values){
    Condition.find({}).exec(function(err,conditionList){
	for(var i =0;i<conditionList.length;i++){
	   conditionList[i].test(values,function(bool,condition){
		    if(bool==true){
			findAllTriggersWithCondition(condition._id,function(err,triggerList){
			    for(var j =0;j<triggerList.length;j++){
				
				triggerList[j].testConditionFalseExists(function(bool,trigger){
				
				    if(bool==false){
					findAllInteractionsWithTrigger(trigger._id,function(err,interactionList){
					    for(var k =0;k<interactionList.length;k++){
						interactionList[k].testTriggerFalseExists(function(err,bool,interaction){
						    if(bool==false){
							Interaction.find({id_:interaction._id}).exec(function(err,interaction){
							    interaction[0].interact();
							})
						    }
						});
					    }
					});
				    }
				});
			    }
			});
		    }
	    });
 
	   
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


sendUpdatedData=function(type,data){
    
}
