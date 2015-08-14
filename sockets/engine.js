var GameSession = require("../models/gamesession");
var engineMethods = require("../GameEngine/EngineMethods");
var PlayerInstance = require("../models/playerinstance");

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
		var progress = require("../controllers/progress-controller")();
		
		socket.on('authenticate', function(data){
			jwtauth.checkToken(data.access_token, function (err, success){
				if (success && !err) {
					socket.auth = true;
					user = jwtauth.decode(data.access_token).iss;
					
					if (data.gameSessionID) {
						GameSession.findById(data.gameSessionID).populate("players").exec(function(err, data){
							if (!err && data) {
								gameSession = data;
								for (var i=0; i < data.players.length; i++) {
									//assuming there is just one player from one user account
									if (data.players[i].user == user) {
										progress.setPlayerInstance(data.players[i]);
										break;
									}
								}
								//console.log(data)
							} else {
								//console.log("no GS")
							}
						});
						clientKey = user+"_"+data.gameSessionID;
						progress.setClientKey(clientKey);
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
		progress.setSocket(socket);
		
		socket.emit("message",{
			"message": "Your are connected"
		});
		
		socket.on("Quest", function(data) {
			switch(data.operation) {
				case "active":
					if (data.quest) {
						progress.setActiveQuest(data.quest);
					} else {
						socket.emit("message",{"message": "Data object was malformed. No quest was sent"})
					}
					break;
				//for testing
				case "finish":
					progress.finishQuest();
					break;
			}
			
			
		});
		//register the channels at which the client can send data
		socket.on('Player', function(data){
		    var logger=log4js.getLogger("channel");
		    logger.setLevel("ERROR");
		    logger.info('Data on channel:"Player" arrived at the server');
		    logger.debug(data);
		    engineMethods.testValues_Condition(data, 'locationCondition', clientKey,progress);
		});
		socket.on('clearDatabase',function(data){
		    var logger=log4js.getLogger("channel");
		    logger.setLevel("ERROR");
		    logger.info('clearDatabase');
		    
		    for (var i in mongoose.connection.collections) {
			mongoose.connection.collections[i].remove(function() { });
		    }
		});
	})
	
}
