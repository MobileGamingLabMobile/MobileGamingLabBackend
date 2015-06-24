var Group = require("../models/group.js");
var Player = require("../models/player.js");

var groupController = {};

groupController.newGroup = function(group_id, res) {
	var newGroup = new Group({

	});
	// müssten die gruppen nicht auf unter game.components.groups aufgeführt werden, genau
	// wie die player-controller?
	newGroup.save(function(err, group) {
		if (err) return res.json({
			success: false,
			message: "Can't create new Group in data base."
		})		
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
			player.groups.push(group_id);
			player.save();
		})
		group.member.push(newMember_id);
		group.save();
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
			player.groups.remove(group_id);//löschen der gruppen_id von den gruppen des spielers
			player.save();
		})
		group.member.remove(member_id);//löschen der player_id (hier member_id) aus dem member array in group.member
		group.save();
		res.json({
			success: true,
			message: "Player is no longer a member of the group."
		});
	})
}

groupController.deleteGroup = function(group_id, res) {
	Group.findById.populate("properties").populate("member").exec(function(err, group){
		if (err) return error(res, "Problems finding group for delete operation.");
		if(!group) return error(res, "Can't find group to delete.");
		if (deep) {
		//remove all linkin

			for (var i in group.properties) {
				group.properties.remove();
			}

			for (var i in group.member) {
				// auch noch die referenz von player auf diese gruppe löschen?
				group.member[i].remove(); //löschen der referenzen von gruppe auf player
			}
		}

		Group.remove({_id: group_id}, null).exec();
		res.json({
			success: true,
			message: "Group successfully deleted."
		});
}

groupController.getGroup = function(group_id, res) {
	Group.findById(group_id, function(err, group){
		if (err) {
			return res.json({
				success:false,
				message: "Not found."
			});
		}
		var current_group = group_id.toString();
		res.json({
			success: true,
			group: current_group,
			message: "Group successfully loaded."
		});
	}
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

module.exports = groupController;