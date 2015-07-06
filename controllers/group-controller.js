var Group = require("../models/group.js");
var Player = require("../models/player.js");
var Game = require("../models/game.js");

var groupController = {};

groupController.newGroup = function(group_id, game_id, res) {
	var newGroup = new Group();

	newGroup.save(function(err, group) {
		if (err) return res.json({
			success: false,
			message: "Can´t create new Group in data base."
		});

		Game.findById(game_id, function(err, game) {
			game.components.groups.push(group._id);
			game.save();
		});	
		res.json({
			success: true,
			group: group,
			message: "New Group successfully created.",
		});
	});
}

groupController.addGroupMember = function(group_id, newMember_id, res) {
	Group.findById(group_id, function(err, group) {
		if (err) {
			return res.json({
				success:false,
				message:"Not found."
			});
		}
		Player.findById(newMember_id, function(err, player){
			if (err) {
				return res.json({
					success:false,
					message:"Not found."
				});
			}
			Player.groups.push(group_id);
			Player.save();
		})
		Group.member.push(newMember_id);
		Group.save();
		res.json({
			success: true,
			message: "Player is now a new member of the group."
		});
	})
}

groupController.removeGroupMember = function(group_id, member_id, res) {
	Group.findById(group_id, function(err, group) {
		if (err) {
			return res.json({
				success:false,
				message:"Not found."
			});
		}
		Player.findById(member_id, function(err, player){
			if (err) {
				return res.json({
					success:false,
					message:"Not found."
				});
			}
			Player.groups.remove(group_id);//löschen der gruppen_id von den gruppen des spielers
			Player.save();
		})
		Group.member.remove(member_id);//löschen der player_id (hier member_id) aus dem member array in group.member
		Group.save();
		res.json({
			success: true,
			message: "Player is no longer a member of the group."
		});
	})
}

groupController.getGroup = function(group_id, res) {
	Group.findById(group_id, function(err, group){
		if (err) {
			return res.json({
				success:false,
				message: "Not found."
			});
		}
		res.json({
			success: true,
			group: group,
			message: "Group successfully loaded."
		});
	});
}

groupController.editGroup = function(group_id, group_data, res) {
	Group.findById(group_id, function(err, group){
		if(err) { 
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
			if (err) return res.json({
				success:false,
				message: "Can't save group."
			});					
		});
		res.json({
			success: true,
			message: "Group successfully edited."
		});
	});
}

groupController.deleteGroup = function(group_id, deep, res) {
	Group.findById(group_id).populate("properties").populate("member").exec(function(err, group){
		if (err) return error(res, "Problems finding group for delete operation.");
		if(!group) return error(res, "Can't find group to delete.");
		if (deep) {
		//remove all linkin
			for (var i=0; i<group.properties.length; i++) {
				group.properties[i].remove();
			}

			for (var j=0; i<group.member.length; j++) {
				group.member[j].remove();
			}
		}

		Game.update({"components.groups": group_id},
			{$pull : {
				"components.groups" : group_id
			}},
			{safe:true},
			function(err) {
				if (err) return error(res, "Can´t remove group from list in game object.")
			});
			group.remove(function(err) {
				if (err) return error (res, "Error whiling removing player object.");
				res.json({
					success: true,
					message: "Group successfully deleted."
				});
			});
	});
}

module.exports = groupController;