

exports=module.exports={};
//Conditions
var loc1={
	coord				:[51, 7.22],
	minSpeed			:30,
	buffer			:20,

};

var locCondition1=new Condition({name:'condition1', available: true, type:'locationCondition',fulfilled: false, locationCondition:loc1});

locCondition1.save();
//-------------------------------------------------------
//Trigger
var trigger1=new Trigger({triggered: false});
trigger1.conditions.push(locCondition1);
trigger1.save(function (err) {
    if (err) throw(err);
    //saved!
})



//--------------------------------------------------
////Quests
var quest2=new Quest( {
    title: 'Quest2',
    available :false,
    started :false,
    finished :false});

quest2.save(function (err) {
    if (err) throw(err);
    //saved!
})



//--------------------------------
//action

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

//----------
//Interaction
var interaction1=new Interaction();
interaction1.trigger.push(trigger1);
interaction1.actions.push(action2);
interaction1.save(function (err) {
    if (err) throw(err);
});
