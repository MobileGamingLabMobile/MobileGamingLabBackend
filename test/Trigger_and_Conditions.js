
mongoose = require('mongoose');
var config= {};
config.db={}
config.db.test="mongodb://mgl:Mobile@localhost:27017/mglData_Test"

expect = require("chai").expect;
var sync = require('synchronize');
//--------------------------
process.env.NODE_ENV = 'test';

Condition = require('../models/condition.js');
Trigger = require('../models/trigger.js');
engine = require("../GameEngine/EngineMethods.js");

before(function (done) { 
  function clearDB (callback) {
	for (var i in mongoose.connection.collections) {
	    mongoose.connection.collections[i].remove(function() { });
	}
	console.log('clearDB');
	return callback();
    }
    function doBefore(callback){
	clearDB(function(){
		objects = require("../lib/Objects.js");
		console.log('doBefore');
	    done();
	});          

    }

    if (mongoose.connection.readyState === 0) {
	mongoose.connect(config.db.test, function (err) {
	    if (err) {
		throw err;
	    } 
	    doBefore();
	  
	});
    } else {
	doBefore();
	
    }


});

after(function (done) {
    mongoose.disconnect();
    return done();
});
//-----------------------------------


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('Database open');
});

describe("Conditions", function(){
    describe('#conditionSchema.methods.test(values)', function(){
	it("should test if the condition is fulfilled", function(done){
	    var values1={};
	    values1.coord={};
	    values1.coord[0]=51;
	    values1.coord[1]=7.22;
	    var test=objects.locCondition1.test(values1);
	    expect(test).to.equal(true);
	    done();
	});

	it("should test if the condition is not fulfilled", function(done){
	    var values2={};
	    values2.coord={};
	    values2.coord[0]=10;
	    values2.coord[1]=700.22;

	    var test=objects.locCondition1.test(values2);
	    expect(test).to.equal(false);
	    done();
	});
    });
    describe("#conditionSchema.methods.setFulfilled(values)", function(){
	it("should test if the value 'fulfilled' changed", function(done){
	    objects.locCondition1.fulfilled=false;
	    expect(objects.locCondition1.fulfilled).to.equal(false);
	    objects.locCondition1.setFulfilled(true);
	    expect(objects.locCondition1.fulfilled).to.equal(true);
	    done();

	});

	describe("#conditionSchema.methods.setFulfilled(values) in method 'test()'", function(){
	    it("should test if the value 'fulfilled' changed", function(done){
		objects.locCondition1.fulfilled=false;
		expect(objects.locCondition1.fulfilled).to.equal(false);
		var values1={};
		values1.coord={};
		values1.coord[0]=51;
		values1.coord[1]=7.22;
		objects.locCondition1.test(values1);
		var test=objects.locCondition1.fulfilled;
		expect(test).to.equal(true);
		done();

	    });
	});
    });
});
describe("Triggers", function(){

    describe("#triggerSchema.methods.testConditionFalseExists()", function(){
	it("should test if all conditions of a trigger1 are fulfilled", function(done){
	    objects.trigger1.testConditionFalseExists(function(err,trigger){
		if(err) return err;
		expect(trigger[0].conditions.length).to.equal(0);
		done();

	    });});
	it("should test if all conditions of a trigger2 are fulfilled", function(done){
	    objects.trigger2.testConditionFalseExists(function(err,trigger){
		if(err) return err;
		if(trigger[0].conditions.length>0){
		    expect(trigger[0].conditions[0].fulfilled).to.equal(false);
		}
		done(); 


	    });

	});
    });

});
describe("Engine", function(){
    it("#exports.findAllTriggersWithCondition(condition_id,callback)", function(done){
	engine.findAllTriggersWithCondition(objects.locCondition3._id,function (err,list){
	    expect(list.length).to.equal(1);
	    if(list[0]){
		expect(list[0]._id).to.eql(objects.trigger1._id);
	    }
	    done(); 
			
	    
	});
	   
	
    });
});


