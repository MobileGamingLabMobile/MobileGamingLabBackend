var Resource = require("../models/resource.js");

var resourceController = {};

resourceController.newResource = function(resource_id, res) {
	var newResource = new Resource({ //leeres Object nicht notwendig <- wie dann?
		//wenn wir bei object sagen, dass es ein typ haben muss wie item etc. dann müsster
		//hier in der erzeuge methode doch eig die erzeugung von object-controller aufgerufen werden oder?
	});
	newResource.save(function(err, resource) {
		if (err) return res.json({
			success: false,
			message: "Can't create new Resource in data base."
		})		
		res.json({
			success: true,
			resource: resource,
			message: "New Resource successfully created."
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
		resource.metadata = mcopy;
		resource.save(function(err) {
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
	Resource.findById.exec(function(err, object){
		if (err) return error(res, "Problems finding object for delete operation.");
		if(!resource) return error(res, "Can't find object to delete.");

		Resource.remove({_id: resource_id}, null).exec();
		res.json({
			success: true,
			message: "Resource successfully deleted."
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
		var current_resource = resource_id.toString();
		res.json({
			success: true,
			resource: current_resource,
			message: "Resource successfully loaded."
		});
	}
}

module.exports = resourceController;