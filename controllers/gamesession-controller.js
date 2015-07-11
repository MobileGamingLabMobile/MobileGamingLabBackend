/**
 * The game session controller handles all the requests that evolve
 * around managing the start of a new game or saving a current game.
 */
var GameSession = require("../models/gamesession");
var Game = require("../models/game");
var Player = require("../models/player");
var PlayerInstance = require("../models/playerinstance");

var gameSessionController = {};

/*
 * helper function that is not exported
 */
error = function(res, message) {
	return res.json({
		success: false,
		message: message
	});
}

/**
 * Starts a new game by creating a brand new game session.
 * owner: String // The owner id
 * game: String // The game id
 * res: Object // The response object created by Express passed from the route
 * 
 * returns:
 * {
 * success: boolean,
 * message: String,
 * gameSession: Object + .roles: [{name: String},...]
 * }
 */
gameSessionController.startNewSession = function(owner, game, res) {
	Game.findById(game).populate("components.quests")
	.populate("components.roles").exec(function(err, game) {
		if (err || !game) error(res, "Database error or game not found.");
		var gs = new GameSession();
		gs.owner = owner;
		gs.game = game;
		gs.started = Date.now();
		
		gs.roles = game.components.roles
		gs.save(function(err) {
			gs.deepPopulate("roles", function(err, session) {
				res.json({
					success: true,
					message: "Game successfully started",
					status: "started",
					gameSession: session
				});
			});
		});
	})
}

/**
 * @param user String UserID
 * @param game String GameID
 * @param session Object GameSession
 */
gameSessionController.resumeSession = function (user, game,session, res) {
		var pinst;
		for (var i = 0; i < session.players.length; i++) {
			var p = session.players[i];
			if (p.user == user) {
				pinst =  p;
				break;
			}
		}
		if (pinst) {
			res.json({
				success: true,
				message: "Resuming Game Session",
				status: "resume",
				playerInstance: pinst
			});
		} else {
			res.json({
				success: true,
				message: "Game was started and no role was selected",
				status: "started",
				gameSession: session
			});
		}
		
		
}

gameSessionController.play = function(user, game, res) {
	GameSession.findOne({$and:
		[{"game":game},{$or : 
			[{"owner": user},{"players.user": user}]
		}]
	}).deepPopulate("players.availableQuests.description players.role players.finishedQuests roles "+
			"players.properties players.resource.type players.groups").exec(function(err, session){
		if (!session) {
			gameSessionController.startNewSession(user,game,res);
		} else {
			gameSessionController.resumeSession(user,game,session,res);
		}
	});
}

gameSessionController.endSession = function(user,sessionID,res) {
	GameSession.findById(sessionID).populate("players").exec(function(err, session){
		if (err || !session) {
			return error(res, "Database error while deleting")
		}
		if (session.owner != user) {
			return error(res, "Can't delete game session. You are not the owner")
		}
		for (var i = 0; i < session.players.length; i++) {
			session.players[i].remove()
		}
		session.remove();
		return res.json({
			success:true,
			message: "The game session was deleted"
		})
	});
}


gameSessionController.joinGame = function(session, user, role_id,res) {
	Player.findOne({role:role_id}).populate("role properties resource iventar.slot").exec(function(err, player){
		var cp = player.toJSON();
		delete cp._id
		var pinst = new PlayerInstance(cp); //creates a copy of the player schema
		pinst.gameSession=session;
		pinst.user = user;
		pinst.resource = []; //reset resources, because the data.type slightly differs (value,type:resource) instead of just resource
		for (var i = 0; i < player.resource.length; i++) {
			curr = player.resource[i];
			pinst.resource.push({
				value: curr.value,
				type: curr._id
			})
		}
		
		Game.findById(session.game).populate("components.initialQuests").exec(function(err, game) {
			for (var index = 0; index < game.components.initialQuests.length; index++) {
				var currentQuest = game.components.initialQuests[index];
				//TODO if role conditions are implemented maybe this needs to be accounted for at this point. Meaning that the quest requirements need to be fullfilled
				pinst.availableQuests.push(currentQuest._id);
				
			}
			pinst.save();
			session.players.push(pinst);
			session.save();
			pinst.deepPopulate("availableQuests.description role finishedQuests"+
			"properties resource.type groups inventar.slot", function(err, player) {
				return res.json({
					success:true,
					status: "selected",
					message: "Role was selected and a player instance was created",
					playerInstance: pinst
				});
			})
			
			
		});

	});
}

/**
 * return the player for the selected role
 */
gameSessionController.selectRole = function (user,sessionID,role_id,res) {
	GameSession.findById(sessionID).populate("players").exec(function(err, session){
		for (var i = 0; i < session.players.length; i++) {
			if (session.players[i].user == user) {
				return res.json({
					success: false,
					message: "You have already chosen your Role."
				});
			}
		}
		gameSessionController.joinGame(session,user,role_id,res);		
	});
}

module.exports = gameSessionController;