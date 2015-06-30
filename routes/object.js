var objectController = require("../controller/object-controller.js");

module.exports = function(app) {

	/** GETOBJECT
	*/
	app.get("/editor/object/:oid", jwtauth.auth, function(req,res){
		objectController.getObject(req.params.item._id, res)
	});

	/** DELETEOBJECT
	*/
	app.delete("/editor/object/:oid", jwtauth.auth, function(req,res){
		itemController.deleteItem(req.params.item._id, req.body.deep, res);
	});

	/** EDITOBJECT
	*/
	//app.post("/object/", jwtauth.auth, function(req,res){
		
	//});
}