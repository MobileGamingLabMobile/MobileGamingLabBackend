var Object = require("../models/object.js"); // "Object" wir glaube ich intern iwie anders verwendet, könnte also zum fehler kommen

var objectController = {};

objectController.newObject = function(object_id, res) {
	var newObject = new Object({

	});
	// müssten die objects nicht auf unter game.components.objects aufgeführt werden, genau
	// wie die player-controller?

	//vermutlich reicht das hier nicht aus, weil wir noch Unterarten haben (MapItem, Item, usw.)
	//vielleicht müssen wir hier noch nen parameter mit Type definieren.
	newObject.save(function(err, Object) {
		if (err) return res.json({
			success: false,
			message: "Can't create new Object in data base."
		})		
		res.json({
			success: true,
			object: object,
			message: "New Object successfully created."
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
		var current_object = object_id.toString();
		res.json({
			success: true,
			object: current_object,
			message: "Object successfully loaded."
		});
	}
}

objectController.deleteObject = function(object_id, res) {
	Object.findById.populate("item").populate("resource").populate("properties").populate("player").exec(function(err, object){
		if (err) return error(res, "Problems finding object for delete operation.");
		if(!object) return error(res, "Can't find object to delete.");
		if (deep) {
			//remove all linkin
			if (object.item)	object.item.remove();

			if (object.resource)	object.resource.remove();

			for (var i in object.properties) {
					object.properties[i].remove();
			}

			if (object.player)	object.player.remove();
		}

		Object.remove({_id: object_id}, null).exec();
		res.json({
			success: true,
			message: "Object successfully deleted."
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
		object.properties = mcopy;
		object.save(function(err) {
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