var Item = require("../models/item.js");
var Game = require("../models/game.js");

// create new itemController object
var itemController = {};

// error handling message
error = function(res, message) {
	return res.json({
		success: false,
		message: message
	});
}

/*	NEWITEM - methode
*	item_id : item.id
*	game_id : game.id
*		game the item is referenced to
*	res	    : response
*/
itemController.newItem = function(game_id, res) {
	// new item object
	var newItem = new Item();

	// save item to data base
	newItem.save(function(err, item) {
		// error response
		if (err) return res.json({
			success: false,
			message: "Can't create new item in data base."
		});

		// connecting the item to the game
		Game.findById(game_id, function(err, game) {
			// pushing item:id to the items array of the game components
			game.components.items.push(item._id);
			game.save();
		});

		// success response with item object
		res.json({
			success: true,
			item: item,
			message: "New item successfully created."
		});
	});
}

/*	GETITEM - methode
*	item_id : item.id
*	res     : response
*/
itemController.getItem = function(item_id, res) {
	// finding item in data base
	Item.findById(item_id, function(err, item) {
		if (err) {
			// error response
			return res.json({
				success:false,
				message: "Not found."
			});
		}
		// success response with item object
		res.json({
			success: true,
			item: item,
			message: "Item successfully loaded."
		});
	});
}

/*	EDITITEM - methode (NOT YET TESTED)
*	item_id   : item.id of the item you want to edit
*	item_data : data about the item to edit
*	res       : response
*/
itemController.editItem = function(item_id, item_data, res) {
	// finding item in data base
	Item.findById(item_id, function(err, item){
		if(err) { 
			// error response
			return res.json({
				success: false,
				message: "Failed to edit item."
			});
		}
		//take all the attributes of the input and push it into the db
		for (key in item_data) {
			value = item_data[key];
			if (value) { //only change if provided and not the same as stored
				if (value != item[key]) {
					item[key] = value;
				}					
			}
		}

		item.save(function(err) {
			// error response
			if (err) return res.json({
				success:false,
				message: "Can't save item."
			});	
			// success response
			res.json({
				success: true,
				message: "Item successfully edited."
			});
		});
	});
}

/*	DELETEITEM - methode
*	item_id   : item.id of the item to delete
*	deep      : variable to clearify whether all references should be deleted too
*	game_id   : game.id the item is related to
*	res       : response
*/
itemController.deleteItem = function(item_id, deep, game_id, res) {
	// find item in data base and populate all its array attributes
	Item.findById(item_id).populate("actions").exec(function(err, item){
		// error response if item is not found
		if (err) return error(res, "Problems finding item for delete operation.");
		if(!item) return error(res, "Can't find item to delete.");

		// if "deep" is "true" all references should be removed too
		if (deep) {
			//remove all linkin
			for (var i=0; i<item.actions.length; i++) {
					item.actions[i].remove();
			}
		}

		// finding game the item is currently in and remove the item of the items array of the game
		Game.findByIdAndUpdate(game_id, 
			{ $pull: { 'components.items' : item_id }}, function(err,game){
				if(err){
					// error response
					return error(res, "Can´t remove item from list in game object.");
				}
				// remove function to remove the current item in data base
				item.remove(function(err) {
					// error response
					if (err) return error(res, "Error whiling removing item object.");
					// success response
					res.json({
						success: true,
						message: "Item successfully deleted."
					});	
				});
				// response of the game object
				return res.json(game);
			});
	});
}

module.exports = itemController;