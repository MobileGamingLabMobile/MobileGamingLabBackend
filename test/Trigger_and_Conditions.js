describe.only("Component Test if error uncomment:setTimeout()", function(){
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
		    objects = require("./lib/Objects.js");
		    console.log('doBefore');
		   // setTimeout(function() {
		    done();
		    //},20);
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
	   
	    function clearDB (callback) {
		for (var i in mongoose.connection.collections) {
		    mongoose.connection.collections[i].remove(function() { });
		}
		console.log('clearDB');
		return callback();
	    }
	  //  clearDB(function(){
		 mongoose.disconnect();
		return done();
	  //  })
	    
	});
describe("Conditions", function(){
    describe('#conditionSchema.methods.test(values)', function(){
	it("should test if the condition is fulfilled", function(done){
	    var values1={};
	    values1.x = 51;
	    values1.y =7.22;
	    objects.locCondition1.test(values1,function(bool,condition){
		expect(bool).to.equal(true);
		    done();
		
	    });
	    
	});

	it("should test if the condition is not fulfilled", function(done){
	    var values2={};
	    values2.coord={};
	    values2.coord[0]=10;
	    values2.coord[1]=700.22;

	    objects.locCondition1.test(values2,function(bool,coondition){
		expect(bool).to.equal(false);
		    done();
	    });
	    
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

    describe("#triggerSchema.methods.testConditionFalseExists(callback)", function(){
	it("should test if all conditions of a trigger1 are fulfilled", function(done){
	    objects.trigger1.testConditionFalseExists(function(bool,trig){

		expect(bool).to.equal(false);
		done();

	    });
	});
	it("should test if all conditions of a trigger2 are fulfilled", function(done){
	    objects.trigger2.testConditionFalseExists(function(bool,trig){
		expect(bool).to.equal(true);

		done(); 


	    });

	});
	it("should test if all conditions of a trigger3 are fulfilled", function(done){
	    objects.trigger3.testConditionFalseExists(function(bool,trig){

		expect(bool).to.equal(false);

		done(); 


	    });

	});
	
    });

});
describe("Interaction", function(){
    describe("#testTriggerFalseExists(callback)", function(){

	it("#interaction1", function(done){
	    objects.interaction1.testTriggerFalseExists(function(err,bool){
		if(err) return err;
		expect(bool).to.equal(true);
		done(); 


	    });
	});
	it("#interaction2", function(done){
	    objects.interaction2.testTriggerFalseExists(function(err,bool){
		if(err) return err;
		expect(bool).to.equal(false);

		done(); 


	    });

	});


    });

    describe("#interactionSchema.methods.interact()", function(){
	it("#test interaction changed quest.started from false to true (if error setTimeout longer!)", function(done){
	    Quest.find({title:'Quest2'}).exec(function(err,quest){
		var started=quest[0].started;
		expect(started).to.eql(false);

		objects.interaction1.interact('gamesession1_client1');
		setTimeout(function() {
		    Quest.find({title:'Quest2'}).exec(function(err,questNew){

			var startedNew=questNew[0].started;
			expect(startedNew).to.eql(true);
			done();
		    });
		}, 20);


	    });
	});
    });
});
describe("Action", function(){
    describe("#interactionSchema.methods.execute()", function(){
	it("## test started changed from false to true", function(done){
	    Quest.find({title:'Quest1'}).exec(function(err,quest){
		var started=quest[0].started;
		expect(started).to.eql(false);

		objects.action1.execute('gamesession1_client1',function(err,quest){

		    Quest.find({_id:quest[0]._id}).exec(function(err,questNew){
			var startedNew=questNew[0].started;
			expect(startedNew).to.eql(true);
			done();
		    });
		});
	    });


	});
    });

});


describe("Engine", function(){
    it("#findAllTriggersWithCondition(condition_id,callback)", function(done){
	engine.findAllTriggersWithCondition(objects.locCondition3._id,function (err,list){
	    expect(list.length).to.equal(1);
	    if(list[0]){
		expect(list[0]._id).to.eql(objects.trigger1._id);
	    }
	    done(); 


	});
    });

    it("#findAllInteractionsWithTrigger(trigger_id,callback)", function(done){
	engine.findAllInteractionsWithTrigger(objects.trigger1._id,function (err,list){
	    expect(list.length).to.equal(2);
	    var resultInteractions=[objects.interaction1._id,objects.interaction3._id];
	    expect([list[0]._id,list[1]._id]).to.deep.have.members(resultInteractions );
	    done(); 
	});


    });
   
});
});
