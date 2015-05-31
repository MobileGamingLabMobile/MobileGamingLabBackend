var gameController = require('../controllers/game-controller');

module.exports = function(app,jwtauth) {
	app.get("/pgames",jwtauth.auth,function(req,res) {
		gameController.getAllPublishedGames(res);
	})
}
