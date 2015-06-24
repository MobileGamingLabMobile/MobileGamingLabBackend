var playerController = require("../controllers/player-controller.js");

module.exports = function(app) {

	/** GETPLAYER
	*/
	app.get("/editor",jwtauth.auth,function(req,res){
		playerController.getPlayer(req.params.player._id, res);
	})

	/** DELETEPLAYER
	*/
	app.delete("/editor/player",jwtauth.auth,function(req,res){
		playerController.deletePlayer(req.params.player._id, res);

	})

	/** EDITPLAYER
	*/
	app.put("/editor/player",jwtauth.auth,function(req,res){
		playerController.editPlayer(req.params.body._id, req.body.meta_data, res);
	})

}