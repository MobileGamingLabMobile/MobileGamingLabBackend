var gameController = require('../controllers/game-controller');

module.exports = function(app,jwtauth) {
	
	app.post("/editor/game",jwtauth.auth,function(req, res){
		var operation = req.body.operation;
		//operations are new, edit
		if (operation == "new") {
			gameController.newGame(req.user.id, res);
		}
		if (operation == "edit"){
			gameController.editGame(req.body.game_id, req.user.id, req.body.meta_data,res);
		}
		
		if (operation == "delete") {
			if (!req.body.game_id) {
				return res.json({
					success: false,
					message: "No Game ID provided."
				});
			}
			gameController.deleteGame(req.body.game_id,req.user.id,res);
		}
		
		if (operation == "publish") {
			gameController.publishGame(req.body.game_id,req.user.id,res)
		}
		
		if (operation == "load") {
			gameController.loadGame(req.body.game_id,res)
		}
	});
};