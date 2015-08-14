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

function ingest (user_id) {
	var g = new Game();
	g.metadata = {
			"name": "GEO1 Test",
			"description": "Ein kurzes Demo-Spiel",
			"category"		: ["Schnitzeljagd"], 
			"owner": user_id,
			"published"		: true,
			"publishedDate"	: 1434624512643,
			"comments": [],
			"rating": 0
		}
	
	var q1 = new Quest();
		q1.title= "Aller Anfang ist schwer";
		q1.requirements= [];
		q1.available= true;
		q1.started= false;
		q1.finished = false;
		
		var q1_descr = new Content();
		q1_descr.name = "Aller Anfang ist schwer - Aufgaben";
		q1_descr.url = "";
		q1_descr.type= "text";
		q1_descr.html= "<li>Gehe zum Parkplatz des GEO1 Institut</li>";
		q1_descr.save();
		q1.description = q1_descr;
		
		var i1 = new Interaction();
			var t1 = new Trigger();
				var c1 = new Condition();
				c1.name ="Location-GEO"; 
				c1.type = "locationCondition";
				c1.locationCondition = {
						"coord":[7.595781,51.969111],
						"buffer": 25.0
					};
				c1.save();
			t1.conditions.push(c1);
			t1.save();
		i1.trigger.push(t1);
		
		var item1 = new Item();
			item1.name = "Bus";
			item1.position = [7.596358, 51.969352];
			item1.buffer = 15.0;
			item1.icon = "http://giv-mgl.uni-muenster.de:8080/img/marker.png";
			item1.save();
			
			var a1 = new Action();
			a1.type = "objectAction";
			a1.game = g;
			a1.objectAction = {
				"placeItemOnMap": true,
				"item" : item1
			};
			a1.save();
		i1.actions.push(a1);
		i1.save();
	q1.tasks.push(i1);
		var i2 = new Interaction();
			var t2 = new Trigger();
				var c2 = new Condition();
					c2.type="objectCondition";
					c2.objectCondition = {
							"collected": "true",
							"object" : item1
						};
					c2.save();
				t2.triggered = false;
				t2.conditions.push(c2);
				t2.save();
			i2.trigger.push(t2);
			var a2 = new Action();
				a2.type = "progressAction";
				a2.game= g;
				a2.progressAction = {
					"finish" : true,
					"interaction": i2 
				};
				a2.save();
			i2.actions.push(a2);
			var a3 = new Action();
				a3.type = "objectAction";
				a3.game= g;
				a3.objectAction = {
					"removeItem" : true,
					"item" : item1
				};
				a3.save();
			i2.actions.push(a3);
			i2.save();
	q1.tasks.push(i2);
		var qe1 = new QuestEvent();
			var ct2 = new Content();
			ct2.name = "Das Ende";
			ct2.url = "";
			ct2.type = "text";
			ct2.html = "Du hast alle Aufgaben bravurös gemeistert und somit endet auch das Spiel";
			ct2.save();
		qe1.sequence.push(ct2);
			var a4 = new Action();
			a4.game = g;
			a4.type = "progressAction";
			a4.progressAction = {
				"finish": true,
				"game": g
			};
			a4.save();
		qe1.actions.push(a4);
		qe1.save();
		q1.questEvent = qe1;
	q1.save();
	g.components.quests.push(q1);
	g.components.initialQuests.push(q1);
	
	/*
	 *	Role
	 */
	var r1 = new Role();
	r1.name = "Teilnehmer";
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
		
	/*
	 * Property
	 */
	var prop1 = new Property({
		name: "Bewegung",
		value: 2,
		type: "int"
	});
	prop1.save();
		
	/*
	 * Player
	 */
	var playerType1 = new Player();
	playerType1.role.push(r1);
	playerType1.resource.push(res1);
	playerType1.properties.push(prop1);
	playerType1.save();
	
	g.save();
	
	User.findById(user_id).exec(function(err, user) {
		user.games.owned.push(g);
		user.games.subscribed.push(g);
		user.save();
	})
}
module.exports = ingest;