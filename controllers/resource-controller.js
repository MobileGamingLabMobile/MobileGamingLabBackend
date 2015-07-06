var Resource = require("../models/resource.js");
var Game = require("../models/game.js");

var resourceController = {};

resourceController.newResource = function(resource_id, res) {
	var newResource = new Resource();

	newResource.save(function(err, resource) {
		if (err) return res.json({
			success: false,
			message: "Can't create new resource in data base."
		});

		Game.findById(game_id, function(err, game) {
			game.components.resource.push(resource._id);
			game.save();
		});

		res.json({
			success: true,
			player: resource,
			message: "New resource successfully created."
		});
	});
}

resourceController.editResource = function(resource_id, resource_data, res) {
	Resource.findById(resource_id, function(err, resource){
		if(err) { 
			return res.json({
				success: false,
				message: "Failed to edit resource."
			});
		}
		//take all the attributes of the input and push it into the db
		mcopy = resource.metadata;
		for (key in resource_data) {
			value = resource_data[key];
			if (value) { //only change if provided and not the same as stored
				if (value != mcopy[key]) {
					mcopy[key] = value;
				}					
			}
		}
		Resource.metadata = mcopy;
		Resource.save(function(err) {
			if (err) return res.json({
				success:false,
				message: "Can't save resource."
			});					
		});
		res.json({
			success: true,
			message: "Resource successfully edited."
		});
	});
}

resourceController.deleteResource = function(resource_id, res) {
	Resource.findById(resource_id).exec(function(err, resource){
		if (err) return error(res, "Problems finding object for delete operation.");
		if(!resource) return error(res, "Can't find object to delete.");

		Game.update({"components.resource": resource_id},
			{$pull : {
				"components.resource": resource_id
			}},
			{safe:true}, 
			function (err) {
				if (err) return error(res, "Can't remove resource from list in game object.");
			});
			resource.remove(function(err) {
				if (err) return error(res, "Error whiling removing resource object.");
				res.json({
				success: true,
				message: "Resource successfully deleted."
				});	
			});
	});
}

resourceController.getResource = function(resource_id, res) {
	Resource.findById(resource_id, function(err, resource){
		if (err) {
			return res.json({
				success:false,
				message: "Not found."
			});
		}
		res.json({
			success: true,
			resource: resource,
			message: "Resource successfully loaded."
		});
	});
}

module.exports = resourceController;