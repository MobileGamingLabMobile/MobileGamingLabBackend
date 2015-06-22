

exports=module.exports={};

var loc={
	coord				:[51, 7.22],
	minSpeed			:30,
	buffer			:20,

};
var locCondition1=new Condition({name:'condition1', available: true, type:'locationCondition',fulfilled: false, locationCondition:loc});
exports.locCondition1=locCondition1;
locCondition1.save();
var locCondition2=new Condition({name:'condition2', available: true, type:'locationCondition',fulfilled: false, locationCondition:loc});
locCondition2.save();



//for Test Trigger
//----------------------------------------------------
var locCondition3=new Condition({name:'condition3', available: true, type:'locationCondition',fulfilled: true, locationCondition:loc});
locCondition3.save();
exports.locCondition3=locCondition3;
var locCondition4=new Condition({name:'condition4', available: true, type:'locationCondition',fulfilled: true, locationCondition:loc});
locCondition4.save();

var locCondition5=new Condition({name:'condition5', available: true, type:'locationCondition',fulfilled: false, locationCondition:loc});
locCondition5.save();
var locCondition6=new Condition({name:'condition6', available: true, type:'locationCondition',fulfilled: true, locationCondition:loc});
locCondition6.save();


trigger1=new Trigger({triggered: false});
trigger1.conditions.push(locCondition3);
trigger1.conditions.push(locCondition4);
trigger1.save(function (err) {
    if (err) throw(err);
     //saved!
})
exports.trigger1=trigger1;

trigger2=new Trigger({triggered: false});
trigger2.conditions.push(locCondition5);
trigger2.conditions.push(locCondition6);
trigger2.save();
exports.trigger2=trigger2;
//end Test Trigger
//-------------------------------------------------
