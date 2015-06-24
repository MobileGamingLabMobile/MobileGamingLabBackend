mongoose = require('mongoose');
config= {};
config.db={}
config.db.test="mongodb://mgl:Mobile@localhost:27017/mglData_Test"

    expect = require("chai").expect;

//--------------------------
process.env.NODE_ENV = 'test';

Condition = require('../models/condition.js');
Trigger = require('../models/trigger.js');
Interaction = require('../models/interaction.js');
engine = require("../GameEngine/EngineMethods.js");
Action = require("../models/action.js");
Quest = require("../models/quest.js");


//-----------------------------------


//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function (callback) {
//console.log('Database open');
//});

describe.only("Engine-- Whole BigTest", function(){
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
		objects = require("../lib/Objects2.js");
//		console.log('doBefore');
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

//  after(function (done) {
//  function clearDB (callback) {
//  for (var i in mongoose.connection.collections) {
//  mongoose.connection.collections[i].remove(function() { });
//  }
//  console.log('clearDB');
//  return done();

//  }

//  //clearDB();
//  mongoose.disconnect();

//  });        


    it("#exports.testValues_Condition(values)(if error setTimeout longer!)", function(done){
	setTimeout(function() {
	    console.log('Whole Big Test');
	    var values1={};
	    values1.coord={};
	    values1.coord[0]=51;
	    values1.coord[1]=7.22;
	    Quest.find({title:'Quest2'}).exec(function(err,quest){
		expect(quest[0].started).to.eql(false);
	    });
	    engine.testValues_Condition(values1);
	    setTimeout(function() {
		Quest.find({title:'Quest2'}).exec(function(err,quest){
		    expect(quest[0].started).to.eql(true);
		    setTimeout(function() {
			done();
		    },100);

		});
		
	    },100);
	},100);

    });
});



