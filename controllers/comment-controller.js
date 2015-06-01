var Game = require("../models/game.js");
var Comment = require("../models/comment.js");

var commentController = {};

commentController.getComments = function(game_id,skip, limit ,res) {
	Comment.find({game: game_id}).sort("-time").skip(skip).limit(limit).exec(
	function(err, comments) {
		res.json({
			success: true,
			message: "Successfully fetched comments.",
			comments: comments
		})
	});
}

commentController.newComment = function(game_id, user_id, time, text, rating, res) {
	var newComment = new Comment();
	newComment.user = user_id;
	newComment.game = game_id;
	newComment.time = time;
	newComment.text = text;
	newComment.rating = rating;
	newComment.save(function(err) {
		if (err) return res.json({
			success: false,
			message: "Can't save comment in data base."
		});
		Game.findByIdAndUpdate(game_id, { $push: {
			"metadata.comments": newComment
		}},{safe: true},function(err, game) {
			if(err) return res.json({
				success: false,
				message: "Can't save comment in the game."
			});
			res.json({
				success: true,
				message: "Comment successfully created."
			});
		});
	})
}

module.exports = commentController;
