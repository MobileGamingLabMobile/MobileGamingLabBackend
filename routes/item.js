var itemController = require("../controller/item-controller.js");

module.exports = function(app) {

	/** GETITEM
	*/
	app.get("/item/", jwtauth.auth, function(req,res){
		itemController.getItem(req.params.item._id, res)
	});

	/** DELETEITEM
	*/
	app.delete("/item/", jwtauth.auth, function(req,res){
		itemController.deleteItem(req.params.item._id, req.body.deep, res);
	});

	/** EDITITEM
	*/
	app.post("/item/", jwtauth.auth, function(req,res){
		var operation = req.body.operation;
		if (operation == "name") {
			var name = {};
			if (req.body.name && req.body.name != "") {
				name = req.body.name;
			}
			itemController.editItem(req.item._id, name, req, res);
		}
	});
}