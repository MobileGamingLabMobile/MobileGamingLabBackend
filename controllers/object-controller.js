var Object = require("../models/object.js");
var Game = require("../models/game.js");

// create new objectController oject
var objectController = {};

// error handling message
error = function(res, message) {
	return res.json({
		success: false,
		message: message
	});
}

/*	NEWOBJECT - methode
*	object_id : object.id
*	game_id   : game.id
*		game the object is related to
*	res       : response
*/
objectController.newObject = function(object_id, game_id, res) {
	// new object object :D
	var newObject = new Object();

	// save object to data base
	newObject.save(function(err, object) {
		// error response
		if (err) return res.json({
			success: false,
			message: "Can't create new object in data base."
		});

		// connecting the object_id to the game
		Game.findById(game_id, function(err, game) {
			// pushing object:id to the objects array of the game components
			game.components.objects.push(object._id);
			game.save();
		});

		// success response with object object
		res.json({
			success: true,
			object: object,
			message: "New object successfully created."
		});
	});
}

/*	GETOBJECT - methode
*	object_id : object.id of the object you want to get
*	res       : response
*/
objectController.getObject = function(object_id, res) {
	// finding object in data base
	Object.findById(object_id, function(err, object){
		if (err) {
			// error response
			return res.json({
				success:false,
				message: "Not found."
			});
		}
		// success response with object object
		res.json({
			success: true,
			object: object,
			message: "Object successfully loaded."
		});
	});
}

/*	DELETEOBJECT - methode
*	object_id : object.id of the object to delete
*	deep      : variable to clearify whether all references should be deleted too
*	game_id   : game.id the object is related to
*	res       : response
*/
objectController.deleteObject = function(object_id, deep, game_id, res) {
	// finding object in data base and populate all its array attributes
	Object.findById(object_id).populate("item").populate("resource").populate("properties").populate("player").exec(function(err, object){
		// error response if object is not found
		if (err) return error(res, "Problems finding object for delete operation.");
		if(!object) return error(res, "Can't find object to delete.");
		
		// if "deep" is "true" all references should be removed too
		if (deep) {
			//remove all linkin
			if (object.item)	object.item.remove();
			//remove all linkin
			if (object.resource)	object.resource.remove();
			//remove all linkin
			for (var i=0; i<object.properties.length; i++) {
					object.properties[i].remove();
			}
			//remove all linkin
			if (object.player)	object.player.remove();
		}

		// finding game the object is currently in and remove the object of the objects array of the game
		Game.findByIdAndUpdate(game_id, 
			{ $pull: { 'components.objects' : object_id }}, function(err,game){
				if(err){
					// error response
					return error(res, "Can´t remove object from list in game object.");
				}
				// remove function to remove the current object in data base
				object.remove(function(err) {
					// error response
					if (err) return error(res, "Error whiling removing object object.");
					// success response
					res.json({
						success: true,
						message: "Object successfully deleted."
					});	
				});
				// response of the game object
				return res.json(game);
			});
	});
}

/*	CHANGEPROPERTIES - methode (NOT YET TESTED)
*	object_id   : object.id of the object you want to change properties
*	object_data : data of the object to change
* 	res         : response
*/
objectController.changeProperties = function(object_id, object_data, res) {
	// finding object in data base
	Object.findById(object_id, function(err, object) {
		if (err) {
			// error resonse
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
			// error response
			if (err) return res.json({
				success:false,
				message: "Can't save object."
			});					
		});
		// success response
		res.json({
			success: true,
			message: "Properties of object successfully changed."
		});
	});
}

module.exports = objectController;