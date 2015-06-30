var groupController = require("../controller/group-controller.js");

module.exports = function(app) {

	/** GETGROUP
	*/
	app.get("/editor/group/:gid", jwtauth.auth, function(req,res){
		groupController.getGroup(req.params.group._id, res)
	});

	/** ADD/REMOVEGROUPMEMBER
	*/
	app.post("/editor/group/member/:mid", jwtauth.auth, function(req,res){
		var operation = req.body.operation;
		if (operation == "addGroupMember"){
			groupController.addGroupMember(req.body.group_id, req.body.player_id, res);
		}
		if (operation == "removeGroupMember") {
			groupController.removeGroupMember(req.body.group_id, req.body.player_id, res);
		}
	});

	/** DELETEGROUP
	*/
	app.delete("/editor/group/:gid", jwtauth.auth, function(req,res){
		groupController.deleteGroup(req.params.group_id, req.body.deep, res);
	});

	/** EDITGROUP
	*/
	//app.post("/group/", jwtauth.auth, function(req,res){

	//});
}