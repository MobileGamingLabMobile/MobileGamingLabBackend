var Item = require("../models/item.js");
var Game = require("../models/game.js");

var itemController = {};

itemController.newItem = function(item_id, game_id, res) {
	var newItem = new Item();

	newItem.save(function(err, item) {
		if (err) return res.json({
			success: false,
			message: "Can't create new item in data base."
		});

		Game.findById(game_id, function(err, game) {
			game.components.items.push(item._id);
			game.save();
		});

		res.json({
			success: true,
			player: item,
			message: "New item successfully created."
		});
	});
}

itemController.getItem = function(item_id, res) {
	Item.findById(item_id, function(err, item) {
		if (err) {
			return res.json({
				success:false,
				message: "Not found."
			});
		}
		res.json({
			success: true,
			item: item,
			message: "Item successfully loaded."
		});
	});
}

itemController.editItem = function(item_id, item_data, res) {
	Item.findById(item_id, function(err, item){
		if(err) { 
			return res.json({
				success: false,
				message: "Failed to edit item."
			});
		}
		//take all the attributes of the input and push it into the db
		mcopy = item.metadata;
		for (key in item_data) {
			value = item_data[key];
			if (value) { //only change if provided and not the same as stored
				if (value != mcopy[key]) {
					mcopy[key] = value;
				}					
			}
		}
		Item.metadata = mcopy;
		Item.save(function(err) {
			if (err) return res.json({
				success:false,
				message: "Can't save item."
			});					
		});
		res.json({
			success: true,
			message: "Item successfully edited."
		});
	});
}

itemController.deleteItem = function(item_id, deep, res) {
	Item.findById(item_id).populate("actions").exec(function(err, item){
		if (err) return error(res, "Problems finding item for delete operation.");
		if(!item) return error(res, "Can't find item to delete.");
		if (deep) {
			//remove all linkin
			for (var i=0; i<item.actions.length; i++) {
					item.actions[i].remove();
			}
		}

		Game.update({"components.items": item_id},
			{$pull : {
				"components.items": item_id
			}},
			{safe:true}, 
			function (err) {
				if (err) return error(res, "Can't remove item from list in game object.");
			});
			item.remove(function(err) {
				if (err) return error(res, "Error whiling removing item object.");
				res.json({
				success: true,
				message: "Item successfully deleted."
				});	
			});
	});
}

module.exports = itemController;