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
		
		for (index in game.components.quests) {
			currentQuest = game.components.quests[index];
			//add quest to the initially available quest if no trigger is specified
			if (currentQuest.requirements) {
				if (currentQuest.requirements.length == 0) {
					gs.availableQuests.push(currentQuest._id);
				}
			}
		}
		gs.roles = game.components.roles
		gs.save(function(err) {
			GameSession.populate(gs,{path:"roles"}, function(err, session) {
				res.json({
					success: true,
					message: "Game successfully started",
					gameSession: session
				});
			});
		});
	})
}

gameSessionController.resumeSession = function (user, game,session, res) {

		res.json({
			success: true,
			message: "Resuming Game Session",
			gameSession: session
		});
	
}

gameSessionController.play = function(user, game, res) {
	GameSession.findOne({"owner": user, "game": game},function(err, session){
		
		if (!session) {
			gameSessionController.startNewSession(user,game,res);
		} else {
			gameSessionController.resumeSession(user,game,session,res);
		}
	});
}

gameSessionController.endSession = function(user,game,res) {
	GameSession.findOne({"owner": user, "game": game},function(err, session){
		session.remove();
		res.json({
			success:true,
			message: "The game session was deleted"
		})
	});
}

/**
 * return the player for the selected role
 */
gameSessionController.selectRole = function(user,game,role_id,res) {
	GameSession.findOne({"owner": user, "game": game},function(err, session){
		Player.findOne({role:role_id}).populate("role properties resource iventar.slot").exec(function(err, player){
			delete player._id;
			var pinst = new PlayerInstance(player);
			pinst.user = user;
			pinst.resource = [];
			for (i in player.resource) {
				curr = player.resource[i];
				pinst.resource.push({
					value: curr.value,
					type: curr._id
				})
			}
			pinst.save();
			session.players.push(pinst);
			session.save();
			res.json({
				success:true,
				message: "Role was selected and a player instance was created",
				playerSchema: player
			})
		});
		
		
	});
}

module.exports = gameSessionController;