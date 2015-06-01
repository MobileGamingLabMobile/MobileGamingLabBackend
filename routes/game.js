var gameController = require('../controllers/game-controller.js');
var commentController = require("../controllers/comment-controller.js");

module.exports = function(app,jwtauth) {
	/**
	 * access_token: String
	 * limit: Number
	 * skip: Number (x-1) times limit for the actual page x
	 */
	app.get("/games/published",jwtauth.auth,function(req,res) {
		gameController.getAllPublishedGames(
				parseInt(req.query.skip),
				parseInt(req.query.limit),
				res);
	});
	
	/**
	 * Sort of an profile page for a published game
	 * 
	 * access_token: String
	 */
	app.get("/games/:gid",jwtauth.auth, function(req,res){
		gameController.getPublishedGameProfile(req.params.gid, res);
	});
	
	/**
	 * operations on an Game
	 * 
	 * access_token: STRING
	 * operation: STRING (subscribe | unsubscribe)
	 * game_id: STRING
	 */
	app.post("/games/:gid", jwtauth.auth, function(req,res){
		operation = req.body.operation
		switch(operation.toLowerCase()) {
		case "subscribe":
			userController.subscribe(req.user.id, req.body.game_id, res)
			break;
		case "unsubscribe":
			userController.unsubscribe(req.user.id, req.body.game_id, res)
			break;
		}
	});
	
	/**
	 * Parameters in body:
	 * access_token: String (created at login used for authentication)
	 * operation: String (get | new)
	 * game_id: String (valid game id)
	 * 
	 * limit: Number (maximum amount of comments that shall be returned) [optional]
	 * skip: Number
	 * 
	 * text: String
	 * rating: Number
	 * time: Date
	 */
	app.post("/games/comment", jwtauth.auth, function(req, res) {
		DEFAULT_LIMIT = 20;
		DEFAULT_SKIP = 0;
		operation = req.body.operation.toLowerCase();
		if (operation == "get") {
			limit = req.body.limit
			skip = req.body.skip
			if (!limit || typeof limit != "number") limit = DEFAULT_LIMIT;
			if (!skip || typeof skip != "number") skip = DEFAULT_SKIP;
			commentController.getComments(req.body.game_id,skip,limit, res);
		}
		if (operation == "new") {
			commentController.newComment(
					req.body.game_id, 
					req.user.id,
					req.body.time,
					req.body.text,
					req.body.rating,
					res);
		}
	})
}
