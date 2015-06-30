var playerController = require("../controllers/player-controller.js");

module.exports = function(app,jwtauth) {

	/** GETPLAYER
	*/
	app.get("/editor/player/:pid",jwtauth.auth,function(req,res){
		playerController.getPlayer(req.params.pid, res);
	})

	/** DELETEPLAYER
	*/
	app.delete("/editor/player/:pid",jwtauth.auth,function(req,res){
		playerController.deletePlayer(req.params.pid, res);

	})

	/** EDITPLAYER
	*/
	app.put("/editor/player/:pid",jwtauth.auth,function(req,res){
		playerController.editPlayer(req.params.pid, req.body.meta_data, res);
	})

}