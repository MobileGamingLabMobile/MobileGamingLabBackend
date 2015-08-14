var User = require('../models/user');
var Game = require("../models/game");
var GameSession = require("../models/gamesession");

var userController = {};

/**
 * Finds and sends back the own profile of a user as part of the status object under
 * the key "user".
 * 
 * @param id The user id
 * @param res The response document
 * 
 * @memberOf userController
 */
userController.getOwnProfile = function(id, res) {
	User.findById(id,function(err, u) {
		if (err) {
			return res.json({
				success: false,
				message: "Private profile not available."
			});
		}
		var resultUser = {
			profile : u.profile,
			login : {
				email :  u.login.email,
				registration : u.login.registration,
				last : u.login.last
			}
		};

		return res.json({
			success: true,
			message: "Private profile successfully loaded.",
			user: resultUser
		});
	});
}

/**
 * Fetches the profile of an user from the database. It will return the user.profile under the
 * key "user".
 * 
 * @param id the user id
 * @param res Response document
 * @return JSON document about status and the user profile 
 * 
 * @memberOf userController
 */
userController.getProfile = function(id, res) {

	User.findById(id, function(err, user) {
		if (err || !user) {
			return res.json({
				success: false,
				message: "Public profile not available. Reason undefined."
			});
		}
		var resUser = {};
		resUser.profile = user.profile;
		
		
		return res.json({
			success: true,
			message: "Public profile successfully loaded.",
			user: resUser
		});
    });
}

/**
 * With this function we can edit the user profile. Use one of the optional parameter
 * to pass information to the system. At the end the client will receive the status object 
 * with a copy of the modified user under the key "user"
 * 
 * @param id The user id to be looked up
 * @param profile All the profile information that needs change in a JSONobject
 * @param req The request document
 * @param res The response document
 * 
 * @memberOf userController
 */
userController.editProfile = function(id, profile, req, res) {
	User.findById(req.user._id, function (err, user){
		var result = {};
		if (err) {
			result.message = err;
		}
		if (profile.name && (!user.profile.name || user.profile.name != profile.name)) {
			req.user.profile.name = user.profile.name = profile.name;
		}
		if (profile.profession && (!user.profile.profession || user.profile.profession != profile.profession)) {
			req.user.profile.profession = user.profile.profession = profile.profession;
		}
		if (profile.country && (!user.profile.country || user.profile.country != profile.country)) {
			req.user.profile.country = user.profile.country = profile.country;
		}
		if (profile.city && (!user.profile.city || user.profile.city != profile.city)) {
			req.user.profile.city = user.profile.city = profile.city;
		}
		var message = user.save(function(err){
			if (err) {
				result.message = "Can't change user.";
			}
		});
		if (message) {
			result.success = false;
			result.message = message;
		} else {
			result.success = true;
			
			//don't return everything of the user
			var selUser = {};
			selUser.profile = req.user.profile;
			selUser.login = {};
			selUser.login.email = req.user.login.email;
			selUser.login.last = req.user.login.last;
			selUser.login.registration = req.user.login.registration;
			
			result.user = selUser;
			result.message = "User successfully updated.";
		}
		return res.json(result);
	});
}

/**
 * This function logs out the user stated by the id and erases the access_token stored in
 * the database. It will send back the status object to the client.
 * 
 * @param id The user id
 * @param res the response document
 * 
 * @memberOf userController
 */
userController.logout = function(id, res) {

	User.findById(id,function(err, user) {
		if (err) { 
			return res.json({
					success: false,
					message: err
			});
		}
		user.login.session_key = "";
		user.save(function(err){
			if (err) {
				return res.json({
					success: false,
					message: "Can't delete session key at logout."
				});
			}
		
			res.json({
					success: true,
					message: "Successfully logged out."
			});
		});
	});
}

/**
 * This method retrieves all owned games by a user as an information services and sends back the 
 * status object with an array of games (without components) under the key "games".
 * 
 * @param user_id The user id
 * @param res the response document
 * 
 * @memberOf userController
 */
userController.getOwnedGames = function(user_id, res) {
	Game.find().where('metadata.owner').equals(user_id).select("-components").exec(function(err, games){
		res.json({
			success: true,
			message: "Own games successfully loaded.",
			games: games
		});
	})
}

/**
 * Lists all the published games that a user owns and sends them back to the client as part of
 * the status document under the key "games" as an array of game objects without the components.
 * 
 * @param user_id The user id
 * @param res the response document
 * 
 * @memberOf userController
 */
userController.getOwnedPublishedGames = function(user_id, res) {
	Game.find().and([{"metadata.owner": user_id},{"metadata.published": true}]).select("-components").exec(function(err, games){
		res.json({
			success: true,
			message: "Own games successfully loaded.",
			games: games
		});
	})
}

/**
 * Retrieves all subscribed games of a user and sends back the array of games.
 * 
 * @param user_id The user id
 * @param res the response document
 * 
 * @memberOf userController
 */
userController.getSubscribedGames = function(user_id,res) {
	User.findById(user_id).populate("games.subscribed").exec(function(err, user) {
		res.json({
			success: true,
			message: "Own games successfully loaded.",
			games: user.games.subscribed
		});
	});
}

/**
 * Subscribes a user to a game and sends back the status object.
 * 
 * @param user_id The user id
 * @param game_id The game id
 * @param res the response document
 * 
 * @memberOf userController
 */
userController.subscribe = function(user_id, game_id, res) {
	//TODO check if already subscribed
	User.findById(user_id, function(err, user) {
		user.games.subscribed.push(game_id);
		user.save();
		
		return res.json({
			success: true,
			message: "User successfully subscribed to game."
		});
	})
}

/**
 * Unsubscribes a user from a game and sends back the status object
 * 
 * @param user_id the user id
 * @param game_id the game id
 * @param res The response document
 * 
 * @memberOf userController
 */
userController.unsubscribe = function(user_id, game_id, res) {
	//TODO check if subscribed
	User.findById(user_id, function(err, user) {
		var pos = user.games.subscribed.indexOf(game_id);
		
		GameSession.find({$and: [{"game":game_id},{"owner":user_id}]}).populate("players").exec(function(err, sessions){
			var session = sessions[0];
			if (err || !session) {
				return error(res, "Database error while deleting")
			}
			if (session.owner._id != user._id) {
				return error(res, "Can't delete game session. You are not the owner")
			}
			
			session.remove();
		});
		
		user.games.subscribed.splice(pos,1);
		user.save();
		
		return res.json({
			success: true,
			message: "User successfully unsubscribed from game."
		});
	})
}

module.exports = userController;