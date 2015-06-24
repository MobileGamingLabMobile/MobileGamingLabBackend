var Player = require("../models/player.js");
var Game = require("../models/game.js");

var playerController = {};

playerController.newPlayer = function(player_id, res) {
	var newPlayer = new Player({

	});
	{$push : {
			"components.player": player_id
			}},
			{safe:true}, 
			function (err) {
				if (err) return error(res, "Can't add player to the list in game object.");
			});
	newPlayer.save(function(err, player) {
		if (err) return res.json({
			success: false,
			message: "Can't create new Player in data base."
		})		
		res.json({
			success: true,
			player: player,
			message: "New Player successfully created."
		});
	});
}

playerController.getPlayer = function(player_id, res) {
	Player.findById(player_id, function(err, player){
		if (err) {
			return res.json({
				success:false,
				message: "Not found."
			});
		}
		var current_player = player_id.toString();
		res.json({
			success: true,
			player: current_player,
			message: "Player successfully loaded."
		});
	}
}

playerController.editPlayer = function(player_id, player_data, res) {
	Player.findById(player_id, function(err, player){
		if(err) { 
			return res.json({
				success: false,
				message: "Failed to edit player."
			});
		}
		//take all the attributes of the input and push it into the db
		mcopy = player.metadata;
		for (key in player_data) { 
		//müssten hier nochmal überlegen ob eventuell noch Array hier mit drin sind, dort müsste man vermutlich auch nochmal über alle Einträge iterieren.
			value = player_data[key];
			if (value) { //only change if provided and not the same as stored
				if (value != mcopy[key]) {
					mcopy[key] = value;
				}				
			}
		}
		player.metadata = mcopy;
		player.save(function(err) {
			if (err) return res.json({
				success:false,
				message: "Can't save player."
			});					
		});
		res.json({
			success: true,
			message: "Player successfully edited."
		});
	});
}

playerController.deletePlayer = function(player_id, res) {
	Player.findById(player_id).populate("properties").populate("groups").populate("resource").populate("position").populate("role").exec(function(err, player){
		if (err) return error(res, "Problems finding player for delete operation.");
		if(!player) return error(res, "Can't find player to delete.");
		if (deep) {
			//remove all linkin
			if (player.resource) player.resource.remove();

			if (player.role) player.role.remove();

			for (var i in player.properties) {
				player.properties.remove();
			}

			for (var i in player.groups) {
				// löschen von player_id aus den jeweiligen gruppen?				
				player.groups[i].remove();
			}		
		}
		Game.update({"components.players": player_id},
			{$pull : {
				"components.player": player_id
			}},
			{safe:true}, 
			function (err) {
				if (err) return error(res, "Can't remove player from list in game object.");
			});
			player.remove(function(err) {
				if (err) return err(res, "Error whiling removing player object.");
			});
			res.json({
				success: true,
				message: "Player successfully deleted."
			})			
		});
}

module.exports = playerController;