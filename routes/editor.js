var gameController = require('../controllers/game-controller');
var questController = require('../controllers/quest-controller');
var conditionController = require('../controllers/condition-controller');
var triggerController = require('../controllers/trigger-controller');

module.exports = function(app,jwtauth) {
	/**
	 * endpoint to create, modify, publish or delete games
	 * 
	 * access_token: STRING
	 * operation: STRING 
	 * 
	 * game_id: STRING
	 * meta_data: Object
	 * {
	 * name			: String,
	 * description		: String, 
	 * category		: [String]
	 * }
	 */
	app.post("/editor/game",jwtauth.auth,function(req, res){
		var operation = req.body.operation.toLowerCase();
		//operations are new, edit
		if (!req.body.game_id && operation != "new") {
			return res.json({
				success: false,
				message: "No Game ID provided."
			});
		}
		
		switch(operation) {
		case "new":
			gameController.newGame(req.user.id, res);
			break;
		case "edit":
			gameController.editGame(req.body.game_id, req.user.id, req.body.meta_data,res);
			break;
		case "delete":
			gameController.deleteGame(req.body.game_id,req.user.id,res);
			break;
		case "publish":
			gameController.publishGame(req.body.game_id,req.user.id,res)
			break;
		case "load":
			gameController.loadGame(req.body.game_id,res)
			break;
		default:
			res.json({
				success: false,
				message: "Operation \""+operation+"\" is not supported by this endpoint."
			})
			break
		}
	});
	
	/**
	 * access_token : STRING
	 * operation: STRING (new | load)
	 * 
	 * game_id : STRING
	 * quest_id: STRING
	 */
	app.post("/editor/quest", jwtauth.auth,function(req,res){
		operation = req.body.operation.toLowerCase();
		
		switch(operation) {
		case "new":
			if (req.body.game_id) {
				questController.newQuest(req.body.game_id, req.user.id, res);
			} else {
				res.json({
					success: false,
					message: "No game id submitted."
				});
			}
			break;
		case "load":
			if (req.body.quest_id) {
				questController.getQuest(req.body.quest_id, res);
			} else {
				res.json({
					success: false,
					message: "No quest id submitted."
				});
			}
			
			break;
		default:
			res.json({
				success: false,
				message: "Operation \""+operation+"\" is not supported by this endpoint."
			})
			break
		}
	});
	
	/**
	 * access_token: String
	 * operation: String (new | load | link_condition | unlink_condition)
	 * 
	 * trigger_id
	 * condition_id
	 */
	app.post("/editor/trigger", jwtauth.auth,function(req,res){
		operation = req.body.operation.toLowerCase();
		
		switch(operation) {
		case "new":
			triggerController.newTrigger(res);
			break;
		case "load":
			if (req.body.quest_id) {
				triggerController.getTrigger(quest_id, res);
			} else {
				res.json({
					success: false,
					message: "No trigger id submitted."
				});
			}
			break;
		case "link_condition":
			triggerController.linkCondition(req.body.trigger_id,req.body.condition_id, res);
			break;
		case "unlink_condition":
			triggerController.unlinkCondition(req.body.trigger_id,req.body.condition_id, res);
			break;
		default:
			res.json({
				success: false,
				message: "Operation \""+operation+"\" is not supported by this endpoint."
			})
			break
		}
	});
	
	/**
	 * access_token : STRING
	 * type : STRING
	 * condition_id : STRING
	 */
	app.put("/editor/condition", jwtauth.auth,function(req,res){
		if (!req.body.condition_id) {
			return conditionController.newCondition(req.body.type,res);
		}
		
		res.json({
			success:false,
			message: "Nothing done."
		})
	});
	
	/**
	 * access_token : STRING
	 * condition: OBJECT (like in the data base schema)
	 */
	app.put("/editor/condition/:cid",jwtauth.auth,function(req,res) {
		comment_id = req.params.cid;
		conditionController.modifyCondition(
				condition_id, 
				req.body.object, 
				res);
	});
};

function isGameOwner(req, res) {
	//TODO implement
}