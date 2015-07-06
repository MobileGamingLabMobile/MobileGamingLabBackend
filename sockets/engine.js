var GameSession = require("../models/gamesession");
var engineMethods = require("../GameEngine/EngineMethods");
/*
 * handle connections of socket
 */
module.exports = function(io,jwtauth) {
	var clients = {};
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
								console.log(data)
							} else {
								console.log("no GS")
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
		      socket.emit("message",{message: "Connection was closed due to no authentification"})
		      return socket.disconnect('unauthorized');
		    } else {
		    	clients[clientKey] = socket.id;	
		    }
		  }, TIMEOUT_UNAUTH);
		
		//define listener channels
		console.log("authorized");
		console.log(gameSession);
		var randomID = Math.round(Math.random()*10000000);
		var goalx = 10;
		var goaly = 10;
		var x = 0;
		var y = 0;
		
		socket.emit("message",{
			"message": "Your are connected"
		});
		
		// check if location 
		socket.on("player", function(data) {
			console.log(data);
			x = data.x;
			y = data.y;
			
			if (x == goalx && y == goaly) {
				socket.emit("message", {"message":"You have won, Dude"});
			}
		});
		socket.on("getID", function() {
			socket.emit("message",{"message": JSON.stringify(clients)});
		});
		socket.on("getCoords", function() {
			socket.emit("message",{"message": x+", "+y});
		});
	})
	
}
