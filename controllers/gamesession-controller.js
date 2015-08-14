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
 * Starts a new game by creating a brand new game session. The object send back to the client
 * looks like:
 * {
 * success: boolean,
 * message: String,
 * gameSession: GameSessionObject + .roles: [{name: String},...]
 * }
 * The game session object will be extended by the available roles. At the end a function will be
 * called to return the extended status object as JSON.
 * 
 * @param owner The owner id as string
 * @param game The game id as string
 * @param res The response object created by Express passed from the route
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
 * This method lets the user resume a game session. Depending on the status the user either
 * resumes the session directly or they still need to choose their role.
 * If the game is resumed then the status object will contain the player instance, otherwise
 * the game session is part of it containing the roles to choose from.
 * 
 * @param user The user id
 * @param game the game id
 * @param session GameSession object
 * @param res The response object
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

/**
 * This function let the player play a game by either starting a new game session or by resuming
 * a previous game state. The functions for for this are called automatically.
 * 
 * @param user the user id
 * @param game the game id
 * @param res the response document
 */
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

/**
 * Ends a game session by deleting all stored information about the game session and the listed
 * player instances. At the end a status object will be send back to the client.
 * 
 * @param user the user id
 * @param sessionID the game session id
 * @param res the response document.
 */
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

/**
 * This function allows a user to join a game by stating the session, the user and the chosen role. 
 * At the end the user will get a status object at which their playerInstance will be appended. This
 * player instance contains the available quest to the player.
 * 
 * @param session the game session id
 * @param user the user id
 * @param role_id the role id
 * @param res the response document
 */
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
 * This function is intended to handle the select role request. That means after a player has decided
 * to play a game they were asked to chose a role. This method will then create an instance of a player 
 * designed by the editor (game player --> player instance)
 * 
 * @param user the user id
 * @param sessionID the session id
 * @param role_id the role id
 * @param res the response document
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