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
	 * Delegates the request to retrieve all published games that are in the system.
	 * 
	 * @param access_token String The authentication string
	 * @param limit Number the amount of results shown in total
	 * @param skip Number (x-1) times limit for the actual page x
	 */
	app.get("/games/published",jwtauth.auth,function(req,res) {
		gameController.getAllPublishedGames(
				parseInt(req.query.skip),
				parseInt(req.query.limit),
				res);
	});
	
	/**
	 * Delegates the request to fetch the games profile part with comments and an description.
	 * 
	 * @param access_token The authentication string
	 */
	app.get("/games/:gid",jwtauth.auth, function(req,res){
		gameController.getPublishedGameProfile(req.params.gid, res);
	});
	
	/**
	 * This route delegates the operations of a user to subscribe and unsubscribe to a game.
	 * The parameter ":gid" needs to be replaced by the game id. 
	 * 
	 * @param access_token The authentication string
	 * @param operation The operation to be performed. Allowed: subscribe | unsubscribe
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
	 * Delegates the request to either get comments on a game or to create a new comment. The
	 * delegation is handled by the "operation" attribute. Allowed are "get" and "new". "Get" sends
	 * back the status object with all comments for the stated interval and "new" results in the
	 * status object.
	 * 
	 * @param access_token The authentication string
	 * @param operation The operation to be performed (get | new)
	 * @param game_id The valid game id
	 * 
	 * @param limit The maximum amount of comments that shall be returned [optional (get)]
	 * @param skip The number of entries to be skipped. [optional (get)]
	 * 
	 * @param text The comment string
	 * @param rating The rating as a numeric value
	 * @param time The time of the rating as Date
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
	 * This route delegates the request to play a game to the gameSessionController. The parameter
	 * ":gid" needs to be replaced by the game id.
	 * 
	 * @param access_token The authentication string
	 */
	app.post("/:gid/play",jwtauth.auth,function(req, res) {
		gameSessionController.play(req.user.id,req.params.gid, res);
	});
	
	/**
	 * This request is designed to delegate the request to cancel a played game. The parameter 
	 * ":gsid" needs to be replaced by the game session id which is send back when the game is 
	 * played.
	 * @param access_token The authentication string
	 */
	app.post("/session/:gsid/remove",jwtauth.auth,function(req, res) {
		gameSessionController.endSession(req.user.id,
				req.params.gsid, 
				res);
	});
	
	/**
	 * Delegates the request to select a role, when a new game was started. The parameter 
	 * ":gsid" needs to be replaced by the game session id.
	 * 
	 * @param acces_token The authentication string
	 * @param role_id The id of the selected role
	 */
	app.post("/session/:gsid/selectRole",jwtauth.auth,function(req, res) {
		if (!req.body.role_id || req.body.role_id == "undefined") {
			return res.json({
				success: false,
				message: "Parameter role_id is missing."
			})
		}
		gameSessionController.selectRole(req.user.id,req.params.gsid,req.body.role_id, res);
	});
	
	/*
	 * Opens the socket test web site.
	 */
//	app.get("/test/gaming",function(req,res){
//		res.render("socket.html");
//	});
}
