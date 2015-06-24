var resourceController = require("../controller/resource-controller.js");

module.exports = function(app) {

	/** GETRESOURCE
	*/
	app.get("/resource/", jwtauth.auth, function(req,res){
		resourceController.getResource(req.params.resource._id, res)
	});

	/** DELETERESOURCE
	*/
	app.delete("/resource/", jwtauth.auth, function(req,res){
		resourceController.deleteResource(req.params.resource._id, req.body.deep, res);
	});

	/** EDITRESOURCE
	*/
	//app.post("/resource/", jwtauth.auth, function(req,res){

	//});
}