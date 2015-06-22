
mongoose = require('mongoose');
var config= {};
config.db={}
config.db.test="mongodb://mgl:Mobile@localhost:27017/mglData_Test"
    mongoose.connect(config.db.test);
//--------------------------
//process.env.NODE_ENV = 'test';
before(function (done) {

    function clearDB() {
	for (var i in mongoose.connection.collections) {
	    mongoose.connection.collections[i].remove(function() {});
	}
	return done();
    }

    if (mongoose.connection.readyState === 0) {
	mongoose.connect(config.db.test, function (err) {
	    if (err) {
		throw err;
	    }
	    return clearDB();
	    done();
	});
    } else {
	// return clearDB();
	done();
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
  //  console.log('Database open');
});

Condition = require('../models/condition.js');

Trigger = require('../models/trigger.js');


var expect = require("chai").expect;
var objects = require("../lib/Objects.js");
var engine = require("../GameEngine/EngineMethods.js");




describe("Conditions", function(){
    describe('#conditionSchema.methods.test(values)', function(){
	it("should test if the condition is fulfilled", function(){
	    var values1={};
	    values1.coord={};
	    values1.coord[0]=51;
	    values1.coord[1]=7.22;
	    var test=objects.locCondition1.test(values1);
	    expect(test).to.equal(true);
	});

	it("should test if the condition is not fulfilled", function(){
	    var values2={};
	    values2.coord={};
	    values2.coord[0]=10;
	    values2.coord[1]=700.22;

	    var test=objects.locCondition1.test(values2);
	    expect(test).to.equal(false);
	});
    });
    describe("#conditionSchema.methods.setFulfilled(values)", function(){
	it("should test if the value 'fulfilled' changed", function(){
	    objects.locCondition1.fulfilled=false;
	    expect(objects.locCondition1.fulfilled).to.equal(false);
	    objects.locCondition1.setFulfilled(true);
	    expect(objects.locCondition1.fulfilled).to.equal(true);


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
