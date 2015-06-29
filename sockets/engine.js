var GameSession = require("../models/gamesession");
/*
 * handle connections of socket
 */
module.exports = function(io,jwtauth) {
	
	io.sockets.on("connection", function(socket) {
		var TIMEOUT_UNAUTH = 2000;
		socket.auth = false;
		var user = "";
		var gameSession = {};
		socket.on('authenticate', function(data){
			jwtauth.checkToken(data.access_token, function (err, success){
				if (success && !err) {
					socket.auth = true;
					user = jwtauth.decode(data.access_token).iss;
				}
			});
			if (data.gameSessionID) {
				GameSession.findById(data.gameSessionID, function(err, data){
					if (!err && data) {
						gameSession = data;
						console.log(data)
					} else {
						console.log("no GS")
					}
				})
			}
		});
		
		setTimeout(function(){
		    //If the socket didn't authenticate, disconnect it
		    if (!socket.auth) {
		      console.log("Disconnecting socket ", socket.id);
		      socket.emit("message",{message: "Connection was closed due to no authentification"})
		      return socket.disconnect('unauthorized');
		    }
		  }, TIMEOUT_UNAUTH);
		
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
		
		socket.on("player", function(data) {
			console.log(data);
			x = data.x;
			y = data.y;
			
			if (x == goalx && y == goaly) {
				socket.emit("message", {"message":"You have won, Dude"});
			}
		});
		socket.on("getID", function() {
			socket.emit("message",{"message": "your ID is "+randomID+"<br/>Le GamesSession:"+JSON.stringify(gameSession)+"<br/>Le USERID:"+user});
		});
		socket.on("getCoords", function() {
			socket.emit("message",{"message": x+", "+y});
		});
	})
	
}
