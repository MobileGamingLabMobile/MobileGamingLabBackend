var Item = require("../models/item.js");

var itemController = {};

itemController.newItem = function(item_id, res) {
	var newItem = new Item({
		//wenn wir bei object sagen, dass es ein typ haben muss wie item etc. dann müsster
		//hier in der erzeuge methode doch eig die erzeugung von object-controller aufgerufen werden oder?
	});
	newItem.save(function(err, item) {
		if (err) return res.json({
			success: false,
			message: "Can't create new Item in data base."
		})		
		res.json({
			success: true,
			item: item,
			message: "New Item successfully created."
		});
	});
}

itemController.getItem = function(item_id, res) {
	Item.findById(item_id, function(err, item){
		if (err) {
			return res.json({
				success:false,
				message: "Not found."
			});
		}
		var current_item = item_id.toString();
		res.json({
			success: true,
			item: current_item,
			message: "Item successfully loaded."
		});
	}
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
		item.metadata = mcopy;
		item.save(function(err) {
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

itemController.deleteItem = function(item_id, res) {
	Item.findById.populate("functions").exec(function(err, object){
		if (err) return error(res, "Problems finding item for delete operation.");
		if(!item) return error(res, "Can't find item to delete.");
		if (deep) {
			//remove all linkin
			for (var i in item.functions) {
					item.functions[i].remove();
			}
		}

		Item.remove({_id: item_id}, null).exec();
		res.json({
			success: true,
			message: "Item successfully deleted."
		});
	});
}

module.exports = itemController;