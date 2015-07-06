var Object = require("../models/object.js");
var Game = require("../models/game.js");

var objectController = {};

objectController.newObject = function(object_id, game_id, res) {
	var newObject = new Object();

	newObject.save(function(err, object) {
		if (err) return res.json({
			success: false,
			message: "Can't create new object in data base."
		});

		Game.findById(game_id, function(err, game) {
			game.components.objects.push(object._id);
			game.save();
		});

		res.json({
			success: true,
			player: object,
			message: "New object successfully created."
		});
	});
}

objectController.getObject = function(object_id, res) {
	Object.findById(object_id, function(err, object){
		if (err) {
			return res.json({
				success:false,
				message: "Not found."
			});
		}
		res.json({
			success: true,
			object: object,
			message: "Object successfully loaded."
		});
	});
}

objectController.deleteObject = function(object_id, deep, res) {
	Object.findById(object_id).populate("item").populate("resource").populate("properties").populate("player").exec(function(err, object){
		if (err) return error(res, "Problems finding object for delete operation.");
		if(!object) return error(res, "Can't find object to delete.");
		if (deep) {
			//remove all linkin
			if (object.item)	object.item.remove();

			if (object.resource)	object.resource.remove();

			for (var i=0; i<object.properties.length; i++) {
					object.properties[i].remove();
			}

			if (object.player)	object.player.remove();
		}

		Game.update({"components.objects": object_id},
			{$pull : {
				"components.objects": object_id
			}},
			{safe:true}, 
			function (err) {
				if (err) return error(res, "Can't remove object from list in game object.");
			});
			object.remove(function(err) {
				if (err) return error(res, "Error whiling removing object object.");
				res.json({
				success: true,
				message: "Object successfully deleted."
				});	
			});
	});
}

objectController.changeProperties = function() {
	Object.findById(object_id, function(err, object) {
		if (err) {
			return res.json({
				success: false,
				message: "Not Found."
			});
		}
		//take all the attributes of the input and push it into the db
		mcopy = object.properties;
		for (key in object_data) {
			value = object_data[key];
			if (value) { //only change if provided and not the same as stored
				if (value != mcopy[key]) {
					mcopy[key] = value;
				}				
			}
		}
		Object.properties = mcopy;
		Object.save(function(err) {
			if (err) return res.json({
				success:false,
				message: "Can't save object."
			});					
		});
		res.json({
			success: true,
			message: "Properties of object successfully changed."
		});
	});
}

module.exports = objectController;