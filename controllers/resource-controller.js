var Resource = require("../models/resource.js");
var Game = require("../models/game.js");

// create new resourceController object
var resourceController = {};

// error handling message
error = function(res, message) {
	return res.json({
		success: false,
		message: message
	});
}

/*	NEWRESOURCE - methode
*	resource_id : resource.id
*	res         : response
*/
resourceController.newResource = function(resource_id, res) {
	// new resource object
	var newResource = new Resource();

	// save reosurce to data base
	newResource.save(function(err, resource) {
		// error response
		if (err) return res.json({
			success: false,
			message: "Can't create new resource in data base."
		});

		// connecting the resource to the game
		Game.findById(game_id, function(err, game) {
			game.components.resource.push(resource._id);
			game.save();
		});

		// success response with resource object
		res.json({
			success: true,
			resource: resource,
			message: "New resource successfully created."
		});
	});
}

/*	EDITRESOURCE - methode (NOT YET TESTED)
*	resource_id   : resource.id of the resource you want to edit
*	resource_data : data about the resource to edit
*	res           : response
*/
resourceController.editResource = function(resource_id, resource_data, res) {
	// find resource in data base
	Resource.findById(resource_id, function(err, resource){
		if(err) { 
			// error response
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
			// error response
			if (err) return res.json({
				success:false,
				message: "Can't save resource."
			});					
		});
		// success response
		res.json({
			success: true,
			message: "Resource successfully edited."
		});
	});
}

/*	DELETERESOURCE - methode
*	resource_id : resource.id of the resource to delete
*	game_id   : game.id the resource is related to
*	res       : response
*/
resourceController.deleteResource = function(resource_id, res) {
	// finding resource in data base
	Resource.findById(resource_id).exec(function(err, resource){
		// error response if resource is not found
		if (err) return error(res, "Problems finding object for delete operation.");
		if(!resource) return error(res, "Can't find object to delete.");

		// finding game the resource is currently in and remove the resource of the resource array of the game
		Game.findByIdAndUpdate(game_id, 
			{ $pull: { 'components.resource' : resource_id }}, function(err,game){
				if(err){
					// error response
					return error(res, "Can´t remove resource from list in game object.");
				}
				// remove function to remove the current resource in data base
				resource.remove(function(err) {
					// error response
					if (err) return error(res, "Error whiling removing resource object.");
					// success response
					res.json({
						success: true,
						message: "Resource successfully deleted."
					});	
				});
				// response of the game object
				return res.json(game);
			});
	});
}

/*	GETRESOURCE - methode
*	resource_id : resource.id
*	res         : response
*/
resourceController.getResource = function(resource_id, res) {
	// finding resource in data base
	Resource.findById(resource_id, function(err, resource){
		if (err) {
			// error response
			return res.json({
				success:false,
				message: "Not found."
			});
		}
		// success response with resource object
		res.json({
			success: true,
			resource: resource,
			message: "Resource successfully loaded."
		});
	});
}

module.exports = resourceController;