var gameController = require('../controllers/game-controller.js');
var commentController = require("../controllers/comment-controller.js");
var userController = require("../controllers/user-controller.js");
var gameSessionController = require("../controllers/gamesession-controller.js");

module.exports = function(app,jwtauth) {
	/*
	 * Hint: Every function in the execution chain carries the request and the request
	 * document. Respectively "req" and "res".
	 * The handling controller functions will use the response document to create the
	 * response message from there. This way it is easier to see which routes are stated
	 * and where they are handled.
	 */
	
	
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
	 */
	app.post("/games/:gid", jwtauth.auth, function(req,res){
		operation = req.body.operation;
		game_id = req.params.gid;
		switch(operation.toLowerCase()) {
		case "subscribe":
			userController.subscribe(req.user.id, game_id, res)
			break;
		case "unsubscribe":
			userController.unsubscribe(req.user.id, game_id, res)
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
	app.post("/comment", jwtauth.auth, function(req, res) {
		var DEFAULT_LIMIT = 20;
		var DEFAULT_SKIP = 0;
		operation = req.body.operation.toLowerCase();

		switch(operation) {
		case "get":
			limit = req.body.limit;
			skip = req.body.skip;
			if (!limit) limit = DEFAULT_LIMIT;
			if (!skip) skip = DEFAULT_SKIP;
			return commentController.getComments(req.body.game_id,skip,limit, res);
		case "new":
			return commentController.newComment(
					req.body.game_id, 
					req.user.id,
					req.body.time,
					req.body.text,
					req.body.rating,
					res);
		default:
			return res.json({
				success: false,
				message: "Non supported operation."
			})
		}	
	});
	
	/**
	 * access_token: String
	 */
	app.post("/:gid/play",jwtauth.auth,function(req, res) {
		gameSessionController.play(req.user.id,req.params.gid, res);
	});
	
	app.post("/:gid/remove",jwtauth.auth,function(req, res) {
		gameSessionController.endSession(req.user.id,req.params.gid, res);
	});
	
	/**
	 * acces_token : String
	 * role_id : String
	 * 
	 * returns
	 * playerSchema
	 */
	app.post("/:gid/selectRole",jwtauth.auth,function(req, res) {
		gameSessionController.selectRole(req.user.id,req.params.gid,req.body.role_id, res);
	});
	
	app.get("/test/gaming",function(req,res){
		res.render("socket.html");
	});
}
