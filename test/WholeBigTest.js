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
websockets=require("./Websocket.js");
ioClient = require('socket.io-client');


//-----------------------------------


//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function (callback) {
//console.log('Database open');
//});

describe("Engine-- Whole BigTest", function(){
    beforeEach(function (done) { 
	function clearDB (callback) {
	    for (var i in mongoose.connection.collections) {
		mongoose.connection.collections[i].remove(function() { });
	    }
	   // console.log('clearDB');
	    setTimeout(function() {
		return callback();
	    },100);
	}
	function doBefore(callback){
	    clearDB(function(){	
//		console.log('doBefore');
		initialize();	
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
    function initialize(){
	values1={};
	values1.coord={};
	values1.coord[0]=51;
	values1.coord[1]=7.22;

	var socketURL = 'http://localhost:3036';

	var options ={
		transports: ['websocket'],
		'force new connection': true
	};

	socket11=ioClient.connect(socketURL,options);
	socket11.emit("addClient",{clientName:'client1'});
    }

    describe("Test Quest updated", function(){
	beforeEach(function(done){
	    objects = require("./lib/Objects2.js");
	  //  console.log('load')
	    setTimeout(function(){
		done();
	    },100);
	});
	it("#exports.testValues_Condition(values)(if error setTimeout longer!)", function(done){

	    //console.log('Whole Big Test');
	    Quest.find({title:'Quest2'}).exec(function(err,quest){
		expect(quest[0].started).to.eql(false);
	    });

	    setTimeout(function() {
		engine.testValues_Condition(values1,'locationCondition','client1');
	    },10);

	    setTimeout(function() {
//console.log(Quest)
		Quest.find({title:'Quest2'}).exec(function(err,quest){
		    expect(quest[0].started).to.eql(true);
		    done();

		});


	    },100);

	});
    });

    describe("SocketTest", function(){
	beforeEach(function(done){
	    objects = require("./lib/Objects3.js");
	   
	    setTimeout(function(){
		done();
	    },20);
	});
	it("#test if client gets message", function(done){

	    socket11.on('Quests',function(data){		
		expect(data[0].title).eql('Quest2');
		done();
	    });

	    setTimeout(function() {
		engine.testValues_Condition(values1,'locationCondition','client1');
	    },200);

	});



    });

});




