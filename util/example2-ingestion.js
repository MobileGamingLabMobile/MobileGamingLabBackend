var Game = require("../models/game");
var Trigger = require("../models/trigger");
var Condition = require("../models/condition");
var Quest = require("../models/quest");
var QuestEvent = require("../models/questEvent");
var Content = require("../models/content");
var Action = require("../models/action");
var Interaction = require("../models/interaction");
var Scene = require("../models/scene");
var Item = require("../models/item");
var Role = require("../models/role");
var Player = require("../models/player");
var Resource = require("../models/resource");
var Property = require("../models/properties");
var User = require("../models/user");

function ingest2 (user_id) {
	var g = new Game();
	g.metadata = {
			"name": "Demo Spiel",
			"description": "Folge einigen Wegpunkten und betrachte das GEO Gebäude von verschiedenen Seiten",
			"category"		: ["DEMO","Schnitzeljagd"], 
			"owner": user_id,
			"published"		: true,
			"publishedDate"	: 1436268147192,
			"comments": [],
			"rating": 0
		}
	
	var q1 = new Quest({
		title: "Der Erste Treffpunkt",
		requirements: [],
		available: true,
		started: false,
		finished: false
	});
	q1.save();
	var q2 = new Quest({
		title: "Am Bus",
		requirements: [],
		available: false,
		started: false,
		finished: false
	});
	q2.save();
	var q3 = new Quest({
		title: "Zurück",
		requirements: [],
		available: false,
		started: false,
		finished: false
	});
	q3.save();
	var desc1 = new Content({
		name : "Der Erste Treffpunkt - Aufgaben",
		url : "",
		type: "text",
		html: "<li>Gehe zum Parkplatz des GEO Instituts</li>"
	});
	desc1.save();
	q1.description = desc1;
	
	//q1.description.save();
	var desc2 = new Content({
		name : "Am Bus - Aufgaben",
		url : "",
		type: "text",
		html: "<li>Gehe zur markierten Stelle (die nächste Bushaltestelle)</li>"
	});
	desc2.save();
	q2.description = desc2;
	
	//q2.description.save();
	var desc3 = new Content({
		name : "Zurück - Aufgaben",
		url : "",
		type: "text",
		html: "<li>Mache dich auf den Rückweg zum Parkplatz des GEO Gabäude</li>"
	});
	desc3.save();
	q3.description = desc3;
	
	//q3.description.save();
	
	//create Trigger and Interactions for quest 1
	var parkplatz = new Item({
		name: "Parkplatz",
		position: [7.595781,51.969111],
		buffer: 25.0,
		icon: ""
	});
	parkplatz.save();
	g.components.items.push(parkplatz);
	
	var q1_i1 = new Interaction();
	
	var q1_i1_a1 = new Action({
		game : g,
		type : "objectAction",
		objectAction : {
			"placeItemOnMap": true,
			"item": parkplatz
		}
	});
	q1_i1_a1.save();
	q1_i1.actions.push(q1_i1_a1);
	q1_i1.save();
	
	q1.tasks.push(q1_i1);
	
	//Second is the go-to interaction
	var q1_i2 = new Interaction();
	var q1_i2_t1 = new Trigger();
		var q1_i2_t1_c1 = new Condition({
			name: "Location-GEOInstitut", 
			type: "locationCondition",
			locationCondition: {
					"coord":[7.595781,51.969111],
					"buffer": 25.0
			}
		});
		q1_i2_t1_c1.save();
	q1_i2_t1.conditions.push(q1_i2_t1_c1);
	q1_i2_t1.save();
	q1_i2.trigger.push(q1_i2_t1);
	
	var q1_i2_a1 = new Action({
		game : g,
		type : "objectAction",
		objectAction : {
			"removeItem": true,
			"item": parkplatz
		}
	});
	q1_i2_a1.save();
	q1_i2.actions.push(q1_i2_a1);
	
	
	q1_i2.save();
	//no action since we just want them to go to the starting place
	q1.tasks.push(q1_i2);
	
	var qe1 = new QuestEvent();
	var qe1_c =  new Content({
		name : "Start",
		url : "",
		type : "text",
		html : "Danke, du bist am Start unserer Tour. Eine neue Aufgabe wurde dir bereitgestellt!"
	});
	qe1_c.save();
	qe1.sequence.push(qe1_c);
	//finish old
	var qe1_a1 = new Action({
		game : g,
		type : "progressAction",
		progressAction : {
			"finish": true,
			"quest": q1
		}
	});
	qe1_a1.save();
	qe1.actions.push(qe1_a1);
	//make available new
	var qe1_a2 = new Action({
		game : g,
		type : "progressAction",
		progressAction : {
			"unlock": true,
			"quest": q2
		}
	});
	qe1_a2.save();
	qe1.actions.push(qe1_a2);
	qe1.save();
	q1.questEvent = qe1;
	q1.save();
	
	//###############################
	//# Quest 2 Bushalte -> Ampel
	//###############################
	var q2_i1 = new Interaction(); //no condition just set item
	//show map item for next --> maybe it would have been better to define some "quest setup actions"
	var bus = new Item({
		name: "Bushaltestelle",
		position: [7.596358, 51.969352],
		buffer: 15.0,
		icon: ""
	});
	bus.save();
	g.components.items.push(bus);
	var q2_i1_a1 = new Action({
		game : g,
		type : "objectAction",
		objectAction : {
			"placeItemOnMap": true,
			"item": bus
		}
	});
	q2_i1_a1.save();
	q2_i1.actions.push(q2_i1_a1);
	q2_i1.save();
	q2.tasks.push(q2_i1);
	
	//go-to
	var q2_i2 = new Interaction();
	var q2_i2_t1 = new Trigger();
		var q2_i2_c1 = new Condition({
			name: "Location-Bus", 
			type: "locationCondition",
			locationCondition: {
					"coord": [7.596358, 51.969352],
					"buffer": 10.0
			}
		});
		q2_i2_c1.save();
	q2_i2_t1.conditions.push(q2_i2_c1);
	q2_i2_t1.save();
	q2_i2.trigger.push(q2_i2_t1);
	//action remove mapItem
	var q2_i2_a1 = new Action({
		game : g,
		type : "objectAction",
		objectAction : {
			"removeItem": true,
			"item": bus
		}
	})
	q2_i2_a1.save();
	q2_i2.actions.push(q2_i2_a1);
	
	
	q2_i2.save();
	q2.tasks.push(q2_i2);
	//questEvent
	var qe2 = new QuestEvent();
	
	var qe2_c =  new Content({
		name : "Bushalte",
		url : "",
		type : "text",
		html : "Gut gemacht. Hier fahren die Busse ab :)"
	});
	qe2_c.save();
	qe2.sequence.push(qe2_c);
	
	var qe2_a2 = new Action({
		game : g,
		type : "progressAction",
		progressAction : {
			"finish": true,
			"quest": q2
		}
	});
	qe2_a2.save();
	qe2.actions.push(qe2_a2);
	
	//make available new
	var qe2_a1 = new Action({
		game : g,
		type : "progressAction",
		progressAction : {
			"unlock": true,
			"quest": q3
		}
	});
	qe2_a1.save();
	qe2.actions.push(qe2_a1);
	
	qe2.save();
	q2.questEvent = qe2;
	q2.save();
	
	//##################
	//# Quest 3 - back
	//##################
	//show map item for next --> maybe it would have been better to define some "quest setup actions"
	var q3_i2 = new Interaction();
	
	var q3_i2_a1 = new Action({
		game : g,
		type : "objectAction",
		objectAction : {
			"placeItemOnMap": true,
			"item": parkplatz
		}
	});
	q3_i2_a1.save();
	q3_i2.actions.push(q3_i2_a1);
	q3_i2.save();
	q3.tasks.push(q3_i2);
	
	
	var q3_i1 = new Interaction();
	var q3_i1_t1 = new Trigger();
		var i3_c1 = new Condition({
			name: "Location-Parkplatz", 
			type: "locationCondition",
			locationCondition: {
					"coord": [7.595781,51.969111],
					"buffer": 25.0
			}
		});
		i3_c1.save();
	q3_i1_t1.conditions.push(i3_c1);
	q3_i1_t1.save();
	
	q3_i1.trigger.push(q3_i1_t1);
	//action remove mapItem
	var q3_i1_a1 = new Action({
		game : g,
		type : "objectAction",
		objectAction : {
			"removeItem": true,
			"item": parkplatz
		}
	})
	q3_i1_a1.save();
	q3_i1.actions.push(q3_i1_a1);
	q3_i1.save();
	q3.tasks.push(q3_i1);
	
	var qe3 = new QuestEvent();
	var qe3_c = new Content({
		name : "Das Ende",
		url : "",
		type : "text",
		html : "Du hast alle Aufgaben bravurös gemeistert und somit endet auch das Spiel."
	});
	qe3_c.save();
	qe3.sequence.push(qe3_c);
	//finish old
	var qe3_a1 = new Action({
		game : g,
		type : "progressAction",
		progressAction : {
			"finish": true,
			"quest": q3
		}
	});
	qe3_a1.save();
	qe3.actions.push(qe3_a1);
	
	var qe3_a2 = new Action({
		game : g,
		type : "progressAction",
		progressAction : {
			"finish": true,
			"game": g
		}
	});
	qe3_a2.save();
	qe3.actions.push(qe3_a2);
	
	qe3.save();
	q3.questEvent = qe3;
	q3.save();
	
	g.components.initialQuests.push(q1);
	g.components.quests.push(q1);
	g.components.quests.push(q2);
	g.components.quests.push(q3);
	
	/*
	 * Role
	 */
	g.components.quests.push(q1);
	var r1 = new Role({
		name : "IfGI Teilnehmer"
	});
	r1.save();
	g.components.roles.push(r1);
	
	/*
	 * Resource
	 */
	var res1 = new Resource({
		name: "Punkte",
		description: "Punkte werden für erfolgreich gelöste Aufgaben vergeben.",
		value: 0
	});
	res1.save();
	g.components.resource.push(res1);
	
	/*
	 * Property
	 */
	var prop1 = new Property({
		name: "Bewegung",
		value: 2,
		type: "int"
	});
	prop1.save();
	
	var playerType1 = new Player();
	playerType1.role.push(r1);
	playerType1.resource.push(res1);
	playerType1.properties.push(prop1);
	playerType1.save();
	
	g.components.players.push(playerType1);
	g.save();
	
	/*
	 * Modify user / owner
	 */
	User.findById(user_id).exec(function(err, user) {
		user.games.owned.push(g);
		user.games.subscribed.push(g);
		user.save();
	})
}

module.exports = ingest2;