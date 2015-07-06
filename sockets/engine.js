var GameSession = require("../models/gamesession");
var engineMethods = require("../GameEngine/EngineMethods");
/*
 * handle connections of socket
 */
module.exports = function(io,jwtauth) {
	clients = {};
	io.sockets.on("connection", function(socket) {
		var TIMEOUT_UNAUTH = 2000;
		socket.auth = false;
		var user = "";
		var gameSession = {};
		var clientKey = "";
		socket.on('authenticate', function(data){
			jwtauth.checkToken(data.access_token, function (err, success){
				if (success && !err) {
					socket.auth = true;
					user = jwtauth.decode(data.access_token).iss;
					
					if (data.gameSessionID) {
						GameSession.findById(data.gameSessionID, function(err, data){
							if (!err && data) {
								gameSession = data;
								//console.log(data)
							} else {
								//console.log("no GS")
							}
						});
						clientKey = user+"_"+data.gameSessionID;
					}
				}
			});
			
		});
		
		setTimeout(function(){
		    //If the socket didn't authenticate, disconnect it
		    if (!socket.auth) {
		      console.log("Disconnecting socket ", socket.id);
		      socket.emit("message",{message: "Connection was closed due to no authentification. Press F5 to refresh the page."})
		      return socket.disconnect('unauthorized');
		    } else {
		    	clients[clientKey] = socket.id;	
		    }
		  }, TIMEOUT_UNAUTH);
		
		//define listener channels
		console.log("authorized");
		console.log(gameSession);
		var progress = require("../controllers/progress-controller")();
		progress.setSocket(socket);
		
		var randomID = Math.round(Math.random()*10000000);
		var goalx = 10;
		var goaly = 10;
		var x = 0;
		var y = 0;
		
		socket.emit("message",{
			"message": "Your are connected"
		});
		
		socket.on("Quest", function(data) {
			if (data.quest) {
				progress.setActiveQuest(data.quest);
			} else {
				socket.emit("message",{"message": "Data object was malformed. No quest was sent"})
			}
			
		});
		socket.on('Player', function(data){
		    console.log('angekommen');
		    console.log(data);
		    console.log(gameSession+'gameSession0')
		    
		engineMethods.testValues_Condition(data, 'locationCondition', clientKey);
		});
		socket.on('clearDatabase',function(data){
		    for (var i in mongoose.connection.collections) {
			mongoose.connection.collections[i].remove(function() { });
		    }
		});
	})
	
}
