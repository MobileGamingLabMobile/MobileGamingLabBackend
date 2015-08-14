var Group = require("../models/group.js");
var Player = require("../models/player.js");
var Game = require("../models/game.js");

// create groupController object
var groupController = {};

// error handling message
error = function(res, message) {
	return res.json({
		success: false,
		message: message
	});
}

/*	NEWGROUP - methode
*	group_id : group.id
*	game_id  : game.id
*		game the group is related to
*	res      : response
*/
groupController.newGroup = function(group_id, game_id, res) {
	// new group object
	var newGroup = new Group();

	// save group to data base
	newGroup.save(function(err, group) {
		// error response
		if (err) return res.json({
			success: false,
			message: "Can´t create new Group in data base."
		});

		// connecting the group_id to the game
		Game.findById(game_id, function(err, game) {
			// pushing group_id to the groups array of the game components
			game.components.groups.push(group._id);
			game.save();
		});

		// success response	with group object
		res.json({
			success: true,
			group: group,
			message: "New Group successfully created.",
		});
	});
}

/*	ADDGROUPMEMBER - methode (NOT YET TESTED)
*	group_id     : group.id
*	newMember_id : player.id of the player is connecting to the group
*	res          : response
*/
groupController.addGroupMember = function(group_id, newMember_id, res) {
	// finding group in data base
	Group.findById(group_id, function(err, group) {
		if (err) {
			// error response
			return res.json({
				success:false,
				message:"Not found."
			});
		}
		// finding player adding to the group
		Player.findById(newMember_id, function(err, player){
			if (err) {
				// error response
				return res.json({
					success:false,
					message:"Not found."
				});
			}
			// pushing the group_id to the groups array of the player
			player.groups.push(group_id);
			player.save();
		})
		// pushing the player_id of the new groupmember to the member array of the group
		group.member.push(newMember_id);
		group.save();
		// success response
		res.json({
			success: true,
			message: "Player is now a new member of the group."
		});
	})
}

/*	REMOVEGROUPMEMBER - methode (NOT YET TESTED)
*	group_id  : group.id
*	member_id : player.id of the player is removed from the group
*	res       : response
*/
groupController.removeGroupMember = function(group_id, member_id, res) {
	// finding group in data base
	Group.findById(group_id, function(err, group) {
		if (err) {
			// error response
			return res.json({
				success:false,
				message:"Not found."
			});
		}
		// finding player in data base which should be removed from the group
		Player.findById(member_id, function(err, player){
			if (err) {
				// error response
				return res.json({
					success:false,
					message:"Not found."
				});
			}
			// remove the group_id out of the groups of the player
			player.groups.remove(group_id);
			player.save();
		})
		// remove the player_id out of the member array of the group
		group.member.remove(member_id);
		group.save();
		// success response
		res.json({
			success: true,
			message: "Player is no longer a member of the group."
		});
	})
}

/*	GETGROUP - methode
*	group_id : group.id
*	res      : response
*/
groupController.getGroup = function(group_id, res) {
	// finding group in data base
	Group.findById(group_id, function(err, group){
		if (err) {
			// error response
			return res.json({
				success:false,
				message: "Not found."
			});
		}
		// success response with group object
		res.json({
			success: true,
			group: group,
			message: "Group successfully loaded."
		});
	});
}

/*	EDITGROUP - methode (NOT YET TESTED)
*	group_id   : group.id
*	group_data : data about the group to edit
*	res        : response
*/
groupController.editGroup = function(group_id, group_data, res) {
	// finding group in data base
	Group.findById(group_id, function(err, group){
		if(err) { 
			// error response
			return res.json({
				success: false,
				message: "Failed to edit group."
			});
		}
		//take all the attributes of the input and push it into the db
		mcopy = group.metadata;
		for (key in group_data) {
			value = group_data[key];
			if (value) { //only change if provided and not the same as stored
				if (value != mcopy[key]) {
					mcopy[key] = value;
				}				
			}
		}
		group.metadata = mcopy;
		group.save(function(err) {
			// error response
			if (err) return res.json({
				success:false,
				message: "Can't save group."
			});					
		});
		// success response
		res.json({
			success: true,
			message: "Group successfully edited."
		});
	});
}

/*	DELETEGROUP - methode
*	group_id : group.id of the group to delete
*	game_id  : game.id the group is related to
*	deep     : variable to clearify whether all references should be deleted too
*	res      : response
*/
groupController.deleteGroup = function(group_id, deep, game_id, res) {
	// find group in data base and populate all is array attributes
	Group.findById(group_id).populate("properties").populate("member").exec(function(err, group){
		// error response if group is not found
		if (err) return error(res, "Problems finding group for delete operation.");
		if(!group) return error(res, "Can't find group to delete.");

		// if "deep" is "true" all references should be removed too
		if (deep) {
			//remove all linkin to properties
			for (var i=0; i<group.properties.length; i++) {
				group.properties[i].remove();
			}
			//remove all linkin to member
			for (var j=0; i<group.member.length; j++) {
				group.member[j].remove();
			}
		}

		// finding game the group is currently in and remove the group of the groups array of the game
		Game.findByIdAndUpdate(game_id,
			{ $pull: { 'components.groups' : group_id}}, function(err,game) {
				if (err) {
					// error response
					return error(res, "Can´t remove gorup from list in game object");
				}
				// remove function to remove the current group in data base
				group.remove(function(err) {
					// error response
					if (err) return error(res, "Error whiling removing group object");
					// success response
					res.json({
						success : true,
						message : "Group successfully deleted."
					});
				});
				// response of the game object
				return res.json(game);
			});
	});
}

module.exports = groupController;