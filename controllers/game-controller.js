var Game = require("../models/game.js");
var User = require("../models/user.js");
var Comment = require("../models/comment.js");

var gameController = {};



gameController.newGame = function(id,res) {
	var newGame = new Game({
		metadata: {
			owner: id
		}
	});
	newGame.save(function(err, game) {
		if (err) return res.json({
			success: false,
			message: "Can't create new Game in data base"
		})

		User.findById(game.metadata.owner, function(err, user){
			if (err) return res.json({
				success: false,
				message: "Can't add ownership of game to user."
			});
			user.games.owned.push(game._id);
			
			user.save();
		});
		
		res.json({
			success: true,
			message: "New Game successfully created.",
			game: game
		});
	});
}

gameController.deleteGame = function(game_id, user_id, res) {
	Game.findById(game_id, function(err, game){
		if (err) {
			return res.json({
				success:false,
				message: "Not found."
			});
		}
		var game_owner = game.metadata.owner.toString();
		if (game_owner != user_id) {
			return res.json({
				success: false,
				message: "No permission to delete this game, you are not the owner."
			});
		}
		User.findById(game.metadata.owner, function(err, user){
			var index = user.games.owned.indexOf(game_owner);
			user.games.owned.splice(index,1);
			user.save();
		});
		Game.remove({_id: game_id}, null).exec();
		res.json({
			success: true,
			message: "Game successfully deleted."
		});
	});
	
	
}


gameController.publishGame = function(game_id, user_id, res) {
	//TODO check if all neccessary fields are filled in
	Game.findById(game_id, function(err, game){
		if(err) return res.json({
			succes: false,
			message: "failed to publish game"
		});
		if (game.metadata.owner != user_id) {
			return res.json({
				success: false,
				message: "No permission to publish this game. You are not the owner."
			});
		}
		game.metadata.published = true;
		game.metadata.publishedDate = Date.now();
		game.save();
		
		return res.json({
			success: true,
			message: "Game successfully published."
		});
	});
}

gameController.editGame = function(game_id, user_id, meta_data,res) {
	Game.findById(game_id, function(err, game){
		if(err) { 
			return res.json({
				succes: false,
				message: "Failed to edit game"
			});
		}
		if (game.metadata.owner.toString() != user_id) {
			return res.json({
				success: false,
				message: "No permission to edit this game. You are not the owner."
			});
		} else {
			//take all the attributes of the input and push it into the db
			mcopy = game.metadata;
			for (key in meta_data) {
				value = meta_data[key];
				if (value) { //only change if provided and not the same as stored
					if (value != mcopy[key]) {
						mcopy[key] = value;
					}
					
				}
			}
			game.metadata = mcopy;
			game.save(function(err) {
				if (err) return res.json({
					success:false,
					message: "Can't save game."
				});
				
				
			});
			res.json({
				success: true,
				message: "Game successfully edited."
			});
		}
	});
}

gameController.loadGame = function(game_id, res) {
	Game.findById(game_id, function(err, game){
		return res.json({
			succes: true,
			message: "Success",
			game : game
		});
	})
}

gameController.getAllPublishedGames = function(skip, limit, res) {
	
	Game.find({"metadata.published":true}, "-components").limit(limit).skip(skip).exec(function(err, games){
		return res.json({
			succes: true,
			message: "Success",
			games : games
		});
	})
}

gameController.getPublishedGameProfile = function(game_id,res) {
	Game.find({$and: [{"_id" : game_id}, 
	                  {"metadata.published": true}]
	},"-components", function(err, game){
		res.json({
			success: true,
			message: "Successfully loaded game.",
			game: game
		});
	})
}

module.exports = gameController;