var gameController = require('../controllers/game-controller');
var questController = require('../controllers/quest-controller');
var conditionController = require('../controllers/condition-controller');
var triggerController = require('../controllers/trigger-controller');
var eventController = require('../controllers/event-controller');
var actionController = require('../controllers/action-controller');
var ingestGame = require("../util/example-game-ingestion");
var ingestGame2 = require("../util/example2-ingestion");
module.exports = function(app,jwtauth) {
	/*
	 * Hint: Every function in the execution chain carries the request and the request
	 * document. Respectively "req" and "res".
	 * The handling controller functions will use the response document to create the
	 * response message from there. This way it is easier to see which routes are stated
	 * and where they are handled.
	 */
	
	/**
	 * This function renders a very basic login screen.
	 */
	app.get("/", function(req,res){
		res.render("login.html");
	});
	
	/**
	 * This route will open the editor view, which is also very basic for now.
	 */
	app.get("/editor",jwtauth.auth,function(req,res){
		res.render("editor.html");
	});
	
	/**
	 * For demonstration purposes this route will ingest an example game into the
	 * database.
	 * 
	 * param:
	 * access_token: String
	 */
	app.put("/editor/game/ingest", jwtauth.auth,function(req,res){
		ingestGame(req.user.id);
		res.json({
			success : true,
			message: "The example game was successfully created"
		})
	});
	app.put("/editor/game/ingest2", jwtauth.auth,function(req,res){
		ingestGame2(req.user.id);
		res.json({
			success : true,
			message: "The example game was successfully created"
		})
	});
	
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
			break;
		}
	});
	
	/**
	 * access_token: String
	 * deep: boolean
	 */
	app.delete("/editor/quest/:qid", function(req, res){
		questController.deleteQuest(req.params.qid, req.body.deep, res);
	});
	
	/**
	 * access_token : STRING
	 * game_id : STRING
	 */
	app.put("/editor/quest", jwtauth.auth, function(req,res){
		if (req.body.game_id) {
			questController.newQuest(req.body.game_id, req.user.id, res);
		} else {
			res.json({
				success: false,
				message: "No game id submitted."
			});
		}
	});
	
	/**
	 * acces_token
	 * quest_meta : OBJECT with parameters else then the triggers, description or interaction, questEvent
	 */
	app.put("/editor/quest/:qid", jwtauth.auth, function(req,res){
		console.log("Trying to edit")
		questController.editQuest(req.params.qid,req.body.quest_meta,res);
	});
	
	/**
	 * access_token:
	 * game_id:
	 * content: CONTENT OBJECT
	 */
	app.put("/editor/quest/:qid/description",jwtauth.auth, function(req,res){
		console.log("Setting description")
		if (req.params.qid) {		
			questController.editDescription(req.params.qid, req.body.content, res);
		} else {
			res.json({
				success: false,
				message: "No game id submitted."
			});
		}
	});
	
	/**
	 * access_token : STRING
	 */
	app.get("/editor/quest/:qid", jwtauth.auth,function(req,res){
			if (req.params.qid) {
				questController.getQuest(req.params.qid, res);
			} else {
				return res.json({
					success: false,
					message: "No quest id submitted."
				});
			}
	});
	
	/**
	 * Creates a new Trigger object and returns it
	 * access_token : String
	 */
	app.put("/editor/trigger",jwtauth.auth,function(req,res){
		triggerController.newTrigger(res);
	});
	
	app.get("/editor/trigger/:tid",jwtauth.auth,function(req,res){
		if (req.params.tid) {
			triggerController.getTrigger(quest_id, res);
		} else {
			res.json({
				success: false,
				message: "No trigger id submitted."
			});
		}
	});
	
	/**
	 * Link or unlink a condition to a trigger.
	 * 
	 * access_token: String
	 * operation: String (link_condition | unlink_condition)
	 * trigger_id
	 * condition_id
	 */
	app.post("/editor/trigger", jwtauth.auth,function(req,res){
		operation = req.body.operation.toLowerCase();
		
		switch(operation) {
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
			break;
		}
	});
	
	/**
	 * Creates a new Condition object
	 * 
	 * access_token : STRING
	 * type : STRING
	 */
	app.put("/editor/condition", jwtauth.auth,function(req,res){
		conditionController.newCondition(req.body.type,res);

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
				req.body.condition, 
				res);
	});
	
	/**
	 * Creates new Event
	 * 
	 * access_token
	 */
	app.put("/editor/quest/:qid/event",jwtauth.auth , function(req,res){
		eventController.newEvent(req.params.qid,req.body.type,res);
	});
	
	/**
	 * access_token
	 */
	app.delete("/editor/event/:eid",jwtauth.auth , function(req,res){
		eventController.deleteEvent(req.params.eid,res);
	});
	
	/**
	 * access_token
	 */
	app.get("/editor/event/:eid",jwtauth.auth , function(req,res){
		eventController.getEvent(req.params.eid,res);
	})
	
	/**
	 * access_token
	 * operation : (link_content | unlink_content | link_function | unlink_function | edit)
	 * sequence_id
	 * function_id
	 * event : QuestEvent object without sequence or functions
	 */
	app.post("/editor/event/:eid",jwtauth.auth , function(req,res){
		operation = req.body.operation.toLowerCase();
		
		switch(operation) {
		case "edit":
			eventController.editEvent(req.params.eid,req.body.event,res);
			break;
		case "link_content": 
			eventController.linkContent(req.params.eid,req.body.content_id,res);
			break;
		case "unlink_content":
			eventController.unlinkContent(req.params.eid,req.body.content_id,res);
			break;
		case "link_function":
			eventController.linkFunction(req.params.eid,req.body.function_id,res);
			break;
		case "unlink_function" :
			eventController.unlinkFunction(req.params.eid,req.body.function_id,res);
			break;
		default:
			res.json({
				success: false,
				message: "Operation \""+operation+"\" is not supported by this endpoint."
			})
			break;
		}	
	});
	
	/**
	 * Create new action
	 * 
	 * type: String
	 * game_id: String
	 */
	app.put("/editor/action/", jwtauth.auth, function(req,res) {
		if (!req.body.type) {
			return res.json({
				success: false,
				message: "No type specified."
			});
		}
		if (!req.body.game_id) {
			return res.json({
				success: false,
				message: "No game specified."
			});
		}
		
		actionController.newAction(req.body.game_id, req.body.type, res);
	});
	
	/**
	 * Get created action
	 */
	app.get("/editor/action/:aid",jwtauth.auth, function(req,res) {
		actionController.getAction(req.params.aid, res);
	})
	
	/**
	 * Fetches the list of action for a game.
	 * game_id 
	 */
	app.get("/editor/action/list", jwtauth.auth, function(req,res) {
		gameController.listActions(req.body.game_id, res);
	})
	
	/**
	 * Delete an Action
	 */
	app.delete("/editor/action/:aid", jwtauth.auth, function(req,res) {
		actionController.deleteAction(req.params.aid, res);
	})
	
	/**
	 * Creates a list of the associate action objects
	 */
	app.get("/editor/:gid/actions",jwtauth.auth, function(req,res){
		gameController.listActions(req.params.gid, res);
	});
};

function isGameOwner(req, res) {
	//TODO implement
}