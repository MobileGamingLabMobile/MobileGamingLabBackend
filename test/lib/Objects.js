

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


var trigger1=new Trigger({triggered: false});
trigger1.conditions.push(locCondition3);
trigger1.conditions.push(locCondition4);
trigger1.save(function (err) {
    if (err) throw(err);
    //saved!
})

exports.trigger1=trigger1;

var trigger2=new Trigger({triggered: false});
trigger2.conditions.push(locCondition5);
trigger2.conditions.push(locCondition6);
trigger2.save();
exports.trigger2=trigger2;
//end Test Trigger
//-------------------------------------------------
//for Test Interaction


var trigger3=new Trigger({triggered: true});
trigger3.save();
exports.trigger3=trigger3;
var trigger4=new Trigger({triggered: true});
trigger4.save();
var interaction1=new Interaction();
interaction1.trigger.push(trigger3);
interaction1.trigger.push(trigger1);
interaction1.trigger.push(trigger2);
interaction1.trigger.push(trigger4);


interaction1.save(function (err) {
    if (err) throw(err);
});
exports.interaction1=interaction1;

var interaction2=new Interaction();
interaction2.trigger.push(trigger3);
interaction2.trigger.push(trigger4);
interaction2.save(function (err) {
    if (err) throw(err);
});
exports.interaction2=interaction2;
//End Test Interaction
//--------------------------------------------------
//Test for Action
var quest1=new Quest( {
    title: 'Quest1',
    available :false,
    started :false,
    finished :false});

quest1.save(function (err) {
    if (err) throw(err);
    //saved!
})


var pAction ={
    start :true,
    unlock :true,
    finish :false,
    quest: quest1 };
action1=new Action({type:'progressAction', progressAction:pAction});
action1.save(function (err) {
    if (err) throw(err);
    //saved!
})
exports.action1=action1;
//End Test for Action
//--------------------------------
//Test interaction/action
var quest2=new Quest( {
    title: 'Quest2',
    available :false,
    started :false,
    finished :false});

quest2.save(function (err) {
    if (err) throw(err);
    //saved!
})

var p2Action ={
    start :true,
    unlock :true,
    finish :false,
    quest: quest2 };
action2=new Action({type:'progressAction', progressAction:p2Action});
action2.save(function (err) {
    if (err) throw(err);
    //saved!
})

interaction1.actions.push(action2);

//End test interaction/action
//----------
//Test for Engine
interaction3=new Interaction();
interaction3.trigger.push(trigger1);
interaction3.trigger.push(trigger4);
interaction3.save(function (err) {
    if (err) throw(err);
});
exports.interaction3=interaction3;
