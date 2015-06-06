var User = require('../models/user');
var Game = require("../models/game");

var userController = {};

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

userController.getProfile = function(id, res) {

	User.findById(id, function(err, user) {
		if (err) {
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

userController.getOwnedGames = function(user_id, res) {
	Game.find().where('metadata.owner').equals(user_id).select("-components").exec(function(err, games){
		res.json({
			success: true,
			message: "Own games successfully loaded.",
			games: games
		});
	})
}

userController.getSubscribedGames = function(user_id,res) {
	User.findById(user_id).populate("games.subscribed").exec(function(err, user) {
		res.json({
			success: true,
			message: "Own games successfully loaded.",
			games: user.games.subscribed
		});
	});
}

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

userController.unsubscribe = function(user_id, game_id, res) {
	//TODO check if subscribed
	User.findById(user_id, function(err, user) {
		var pos = user.games.subscribed.indexOf(game_id);
		
		user.games.subscribed.splice(pos,1);
		user.save();
		
		return res.json({
			success: true,
			message: "User successfully unsubscribed from game."
		});
	})
}

module.exports = userController;