var Player = require("../models/player.js");
var Game = require("../models/game.js");

// create new playerController object
var playerController = {};

// error handling message
error = function(res, message) {
	return res.json({
		success: false,
		message: message
	});
}

/*	NEWPLAYER - methode
*	player_id : player.id
*	game_id   : game.id
*		game the player is playing in
*	res       : response
*/
playerController.newPlayer = function(player_id, game_id, res) {
	// new player object
	var newPlayer = new Player();

	// save player to data base
	newPlayer.save(function(err, player) {
		// error response
		if (err) return res.json({
			success: false,
			message: "Can't create new Player in data base."
		});

		// connecting the player_id to the game
		Game.findById(game_id, function(err, game) {
			// pushing player_id to the players array of the game components
			game.components.players.push(player._id);
			game.save();
		});

		// success response with player object
		res.json({
			success: true,
			player: player,
			message: "New Player successfully created."
		});
	});
}

/*	GETPLAYER - methode
*	player_id : player.id  of the player you want to get
*	res       : response
*/
playerController.getPlayer = function(player_id, res) {
	// finding player in data base
	Player.findById(player_id, function(err, player) {
		if (err) {
			// success response
			return res.json({
				success:false,
				message: "Not found."
			});
		}
		// success response with player object
		/*
		* if player.id not exists the player object will be "NULL" but success is "true"
		*/
		res.json({
			success: true,
			player: player,
			message: "Player successfully loaded."
		});
	});
}

/*	EDITPLAYER - methode (NOT YET TESTED)
*	player_id : player.id of the player you want to edit
*	meta_data : data about the player to edit
*	res       : response
*/
playerController.editPlayer = function(player_id, meta_data, res) {
	// finding player in data base
	Player.findById(player_id, function(err, player){
		if(err) {
			// error response
			return res.json({
				success: false,
				message: "Failed to edit player."
			});
		}
		//take all the attributes of the input and push it into the db
		mcopy = player.metadata;
		for (key in meta_data) { 
			value = meta_data[key];
			if (value) { //only change if provided and not the same as stored
				if (value != mcopy[key]) {
					mcopy[key] = value;
				}				
			}
		}
		player.metadata = mcopy;
		player.save(function(err) {
			// error response
			if (err) return res.json({
				success:false,
				message: "Can't save player."
			});					
		});
		// success response
		res.json({
			success: true,
			message: "Player successfully edited."
		});
	});
}

/*	DELETEPLAYER - methode
*	player_id : player.id of the player to delete
*	deep      : variable to clearify whether all references should be deleted too
*	game_id   : game.id the player is related to
*	res       : response
*/
playerController.deletePlayer = function(player_id, deep, game_id, res) {
	// find player in data base and populate all its array attributes
	Player.findById(player_id).populate("properties").populate("groups").populate("resource").populate("position").
	populate("role").exec(function(err, player){
		// error response if player is not found
		if (err) return error(res, "Problems finding player for delete operation.");
		if(!player) return error(res, "Can't find player to delete.");

		// if "deep" is "true" all references should be removed too
		if (deep) {
			//remove all linkin  to resource
			if (player.resource) player.resource.remove();
			//remove all linkin  to roles
			if (player.role) player.role.remove();
			//remove all linkin  to properties
			for (var i=0; i<player.properties.length; i++) {
				player.properties[i].remove();
			}
			//remove all linkin  to groups
			for (var j=0; j<player.groups.length; j++) {		
				player.groups[j].remove();
			}
		}

		// finding game the player is currently in and remove the player of the players array of the game
		Game.findByIdAndUpdate(game_id, 
			{ $pull: { 'components.players' : player_id }}, function(err,game){
				if(err){
					// error response
					return error(res, "Can´t remove player from list in game object.");
				}
				// remove function to remove the current player in data base
				player.remove(function(err) {
					// error response
					if (err) return error(res, "Error whiling removing player object.");
					// success response
					res.json({
						success: true,
						message: "Player successfully deleted."
					});	
				});
				// response of the game object
				return res.json(game);
			});
	});			
}

module.exports = playerController;