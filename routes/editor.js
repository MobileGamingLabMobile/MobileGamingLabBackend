var gameController = require('../controllers/game-controller');
var questController = require('../controllers/quest-controller');
var conditionController = require('../controllers/condition-controller');
var triggerController = require('../controllers/trigger-controller');
var eventController = require('../controllers/event-controller');
var actionController = require('../controllers/action-controller');
var ingestGame = require("../util/example-game-ingestion");
var ingestGame2 = require("../util/example2-ingestion");
var playerController = require("../controllers/player-controller");
var groupController = require("../controllers/group-controller.js");
var itemController = require("../controllers/item-controller.js");
var objectController = require("../controllers/object-controller.js");
var resourceController = require("../controllers/resource-controller.js");
var interactionController = require("../controllers/interaction-controller.js");

module.exports = function(app,jwtauth) {

	/*
	 * Hint: Every function in the execution chain carries the request and the request
	 * document. Respectively "req" and "res".
	 * The handling controller functions will use the response document to create the
	 * response message from there. This way it is easier to see which routes are stated
	 * and where they are handled.
	 */
	
	
	/*
	 * This route will open the editor view, which is  very basic for now.
	 */
//	app.get("/editor",function(req,res){
//		res.render("editor.html");
//	});
	
	/*
	 * For demonstration purposes this route will ingest an example game into the
	 * database.
	 * 
	 * param:
	 * access_token: String
	 */
//	app.put("/editor/game/ingest", jwtauth.auth,function(req,res){
//		ingestGame(req.user.id);
//		res.json({
//			success : true,
//			message: "The example game was successfully created"
//		})
//	});
//	app.put("/editor/game/ingest2", jwtauth.auth,function(req,res){
//		ingestGame2(req.user.id);
//		res.json({
//			success : true,
//			message: "The example game was successfully created"
//		})
//	});
	
	/**
	 * Delegates the requests to create, modify, publish, delete games or load the game components.
	 * 
	 * @param access_token The authentication string
	 * @param operation: "new" | "edit" | "delete" | "publish" | "load"
	 * 
	 * @param game_id: The game id
	 * @param meta_data: A JSON object containing the meta data
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
	 * Delegates the request to delete a quest. On call ":qid" needs to be replaced by the
	 * quesst id.
	 * 
	 * @param access_token The authentication string
	 * @param deep Whether or not all sub objects shall be deleted
	 */
	app.delete("/editor/quest/:qid", function(req, res){
		questController.deleteQuest(req.params.qid, req.body.deep, res);
	});
	
	/**
	 * Delegates the request to create a new and empty quest.
	 * 
	 * @param access_token The authentication string
	 * @param game_id The game id
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
	 * Delegates the request to edit a quest by sending the meta data object as stated in the
	 * schema definition.
	 * 
	 * @param acces_token The authentication string
	 * @param quest_meta JSONObject with parameters else then the triggers, description or interaction, questEvent
	 */
	app.put("/editor/quest/:qid", jwtauth.auth, function(req,res){
		questController.editQuest(req.params.qid,req.body.quest_meta,res);
	});
	
	/**
	 * Delegates the request to edit the quest description by sending a content object. The parameter 
	 * ":gid" needs to be replaced by the quest id on call.
	 * 
	 * @param acces_token The authentication string
	 * @param content A content object
	 */
	app.put("/editor/quest/:qid/description",jwtauth.auth, function(req,res){
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
	 * Delegates the request to get a specific quest. The parameter 
	 * ":gid" needs to be replaced by the quest id on call.
	 * 
	 * @param acces_token The authentication string
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
	 * Delegates the request to create a new Trigger object.
	 * 
	 * @param acces_token The authentication string
	 */
	app.put("/editor/trigger",jwtauth.auth,function(req,res){
		triggerController.newTrigger(res);
	});
	
	/**
	 * Delegates the request to get a specific trigger. ":tid" needs to be
	 * replaced by the trigger id on call.
	 * 
	 * @param acces_token The authentication string
	 */
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
	 * Delegates the request to link or unlink a condition to a trigger.
	 * 
	 * @param acces_token The authentication string
	 * @param operation Allowed values: link_condition | unlink_condition
	 * @param trigger_id The trigger id
	 * @param condition_id The condition id
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
	 * Delegates the request to create a new and empty Condition object.
	 * 
	 * @param acces_token The authentication string
	 * @param type One of the supported types for a condition
	 */
	app.put("/editor/condition", jwtauth.auth,function(req,res){
		conditionController.newCondition(req.body.type,res);

		res.json({
			success:false,
			message: "Nothing done."
		})
	});
	
	/**
	 * Delegates the request to edit a condition. ":cid" needs to be replaced by a
	 * condition id on call.
	 * 
	 * @param acces_token The authentication string
	 * @param condition: Condition object (like in the data base schema)
	 */
	app.put("/editor/condition/:cid",jwtauth.auth,function(req,res) {
		comment_id = req.params.cid;
		conditionController.modifyCondition(
				condition_id, 
				req.body.condition, 
				res);
	});
	
	/**
	 * Delegates the request to creates new and empty Event for a given quest. ":qid" needs to
	 * be replaced by the quest id on call.
	 * 
	 * @param acces_token The authentication string
	 */
	app.put("/editor/quest/:qid/event",jwtauth.auth , function(req,res){
		eventController.newEvent(req.params.qid, res);
	});
	
	/**
	 * Delegates the request to delete a quest event. Replace ":eid" with the event id on call.
	 * 
	 * @param acces_token The authentication string
	 */
	app.delete("/editor/event/:eid",jwtauth.auth , function(req,res){
		eventController.deleteEvent(req.params.eid,res);
	});
	
	/**
	 * Delegates the request to edit a quest event. Replace ":eid" with the event id on call.
	 * 
	 * @param acces_token The authentication string
	 */
	app.get("/editor/event/:eid",jwtauth.auth , function(req,res){
		eventController.getEvent(req.params.eid,res);
	})
	
	/**
	 * This route delegates the manipulation of an event object. Replace ":eid" with the event id on call.
	 * It allows to either to "edit" the meta data of the event by sending the event object or
	 * you can link or unlink content and functions by stating the content_id or the function_id.
	 * 
	 * @param acces_token The authentication string
	 * @param operation One of the following choices (link_content | unlink_content | link_function | unlink_function | edit)
	 * @param content_id The sequence id that needs to be linked 
	 * @param function_id The function id that shall be linked to the event
	 * @param event The QuestEvent object without content or functions
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
	 * Delegates the request to create a new and empty action
	 * 
	 * @param acces_token The authentication string
	 * @param type The action type as stated in the documentation
	 * @param game_id The game id under which the action is registered
	 */
	app.put("/editor/action", jwtauth.auth, function(req,res) {
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
	 * Delegates the request to return a created action. Replace ":aid" with the action id
	 * on the call.
	 * 
	 * @param acces_token The authentication string
	 */
	app.get("/editor/action/:aid",jwtauth.auth, function(req,res) {
		actionController.getAction(req.params.aid, res);
	})
	
	/**
	 * Delegates the request to edit a created action. Replace ":aid" with the action id
	 * on the call.
	 * 
	 * @param acces_token The authentication string 
	 * @param data An action object
	 */
	app.put("/editor/action/:aid",jwtauth.auth, function(req,res) {
		actionController.modifyAction(req.params.aid,req.body.data, res);
	})
	
	/**
	 * Delegates the request to list all registered actions of a game.
	 * 
	 * @param acces_token The authentication string
	 * @param game_id The game id 
	 */
	app.get("/editor/action/list", jwtauth.auth, function(req,res) {
		gameController.listActions(req.body.game_id, res);
	})
	
	/**
	 * Delegates the request to list all registered actions of a game. Replace ":gid" with
	 * the game id.
	 * 
	 * @param acces_token The authentication string
	 */
	app.get("/editor/:gid/actions",jwtauth.auth, function(req,res){
		gameController.listActions(req.params.gid, res);
	});
	
	/**
	 * Delegates the request to delete an action. Replace ":aid" with the action id
	 * on the call.
	 * 
	 * @param acces_token The authentication string
	 */
	app.delete("/editor/action/:aid", jwtauth.auth, function(req,res) {
		actionController.deleteAction(req.params.aid, res);
	})
	
	/** NEWPLAYER
	 * @param acces_token The authentication string
	*	pid : player id
	*	gid : game id
	*/
	app.put("/editor/player",jwtauth.auth,function(req, res){
		if (req.body.game_id) {
			playerController.newPlayer(req.params.pid, req.body.game_id, res);
		}
	});

	/** GETPLAYER
	 * @param acces_token The authentication string
	*	pid : player id
	*/
	app.get("/editor/player/:pid",jwtauth.auth,function(req, res){
		playerController.getPlayer(req.params.pid, res);
	});

	/** DELETEPLAYER
	 * @param acces_token The authentication string
	*	pid : player id
	*	deep: if remove the deeper references
	*/
	app.delete("/editor/player/:pid",jwtauth.auth,function(req, res){
		playerController.deletePlayer(req.params.pid, req.body.deep, req.body.game_id, res);
	});

	/** EDITPLAYER
	 * @param acces_token The authentication string
	*	pid : player id
	*/
	app.put("/editor/player/:pid",jwtauth.auth,function(req, res){
		playerController.editPlayer(req.params.pid, req.body.meta_data, res);
	});


	/** NEWGROUP
	 * @param acces_token The authentication string
	*	gpid : group id
	*	gid : game if
	*/
	app.put("/editor/group",jwtauth.auth,function(req, res){
		if (req.body.game_id){
			groupController.newGroup(req.params.gpid, req.body.game_id, res);
		}
	});

	/** GETGROUP
	 * @param acces_token The authentication string
	*	gpid : group id
	*/
	app.get("/editor/group/:gid", jwtauth.auth, function(req, res){
		groupController.getGroup(req.params.gpid, res)
	});

	/** ADD/REMOVEGROUPMEMBER
	 * @param acces_token The authentication string
	*	gpid : group id
	*/
	app.post("/editor/group/member/:mid", jwtauth.auth, function(req, res){
		var operation = req.body.operation;
		if (operation == "addGroupMember"){
			groupController.addGroupMember(req.body.gpid, req.body.player_id, res);
		}
		if (operation == "removeGroupMember") {
			groupController.removeGroupMember(req.body.gpid, req.body.player_id, res);
		}
	});

	/** DELETEGROUP
	 * @param acces_token The authentication string
	*	gpid : group id
	*/
	app.delete("/editor/group/:gpid", jwtauth.auth, function(req, res){
		groupController.deleteGroup(req.params.gpid, req.body.deep, req.body.game_id, res);
	});


	/** NEWOBJECT
	 * @param acces_token The authentication string
	 *	oid : object id
	 *	gid : game id
	 */
	app.put("/editor/object",jwtauth.auth,function(req, res){
		if (req.body.game_id){
			objectController.newObject(req.params.oid, req.body.game_id, res);
		}
	});

	/** GETOBJECT
	 * @param acces_token The authentication string
	*	oid : object id
	*/
	app.get("/editor/object/:oid", jwtauth.auth, function(req, res){
		objectController.getObject(req.params.oid, res);
	});

	/** DELETEOBJECT
	 * @param acces_token The authentication string 
	*	oid : object id
	*/
	app.delete("/editor/object/:oid", jwtauth.auth, function(req, res){
		objectController.deleteObject(req.params.oid, req.body.deep, req.body.game_id, res);
	});


	/** NEWITEM
	 * @param acces_token The authentication string
	*	gid : game id
	*/
	app.put("/editor/item",jwtauth.auth,function(req,res){
		if (req.body.game_id){
			itemController.newItem(req.body.game_id, res);
		}
	});

	/** GETITEM
	 * @param acces_token The authentication string
	*	iid : item id
	*/
	app.get("/editor/item/:iid", jwtauth.auth, function(req,res){
		itemController.getItem(req.params.iid, res)
	});

	/** DELETEITEM
	 * @param acces_token The authentication string
	*	iid : item id
	*/
	app.delete("/editor/item/:iid", jwtauth.auth, function(req,res){
		itemController.deleteItem(req.params.iid, req.body.deep, req.body.game_id, res);
	});

	/** EDITITEM
	 * @param acces_token The authentication string
	*	iid : item id
	*	data (item object)
	*/
	app.put("/editor/item/:iid", jwtauth.auth, function(req,res){
		itemController.editItem(req.params.iid, req.body.data, res);
	});


	/** NEWRESOURCE
	 * @param acces_token The authentication string
	*	rid : resource id
	*	gid : game id
	*/
	app.put("/editor/resource",jwtauth.auth,function(req,res){
		if (req.body.game_id){
			resourceController.newResource(req.params.rid, req.body.game_id, res);
		}
	});

	/** GETRESOURCE
	 * @param acces_token The authentication string
	*	rid : resource id
	*/
	app.get("/editor/resource/:rid", jwtauth.auth, function(req,res){
		resourceController.getResource(req.params.rid, res);
	});

	/** DELETERESOURCE
	 * @param acces_token The authentication string
	*	rid : resource id
	*/
	app.delete("/editor/resource/:rid", jwtauth.auth, function(req,res){
		resourceController.deleteResource(req.params.rid, req.body.deep, req.body.game_id, res);
	});


	/** NEWINTERACTION
	 * @param acces_token The authentication string
	*	quest id: String
	*/
	app.put("/editor/interaction", jwtauth.auth, function(req,res){
		if (req.body.quest_id){
			interactionController.newInteraction(req.body.quest_id, res);
		}
	});

	/**	GETINTERACTION
	 * @param acces_token The authentication string
	*	iid : interaction id
	*/
	app.get("/editor/interaction/:iid", jwtauth.auth, function(req,res){
		interactionController.getInteraction(req.params.iid, res);
	});

	/**	DELETEINTERACTION
	 * @param acces_token The authentication string
	*	iid : interaction id
	*/
	app.delete("/editor/interaction/:iid", jwtauth.auth, function(req,res){
		interactionController.deleteInteraction(req.params.iid, req.body.deep, req.body.quest_id, res);
	});

	/** ADDTRIGGER OR ADDACTION
	 * @param acces_token The authentication string
	*	operation : should be trigger or action
	*	trigger_id or action_id depend on what you want to add
	*/
	app.put("/editor/interaction/:iid", jwtauth.auth, function(req,res){
		var operation = req.body.operation;
		if (operation == "trigger") {
			interactionController.addTrigger(req.params.iid, req.body.trigger_id, res);
		}
		if (operation == "action") {
			interactionController.addAction(req.params.iid, req.body.action_id, res);
		}
	});

	/** REMOVETRIGGER OR REMOVEACTION
	 * @param acces_token The authentication string
	*	operation: should be trigger or action
	*	trigger_id or action_id depend on what you want to remove
	*/
	app.post("/editor/interaction/:iid", jwtauth.auth, function(req,res){
		var operation = req.body.operation;
		if (operation == "trigger") {
			interactionController.removeTrigger(req.params.iid, req.body.trigger_id, res);
		}
		if (operation == "action") {
			interactionController.removeAction(req.params.iid, req.body.action_id, res);
		}
	});

};