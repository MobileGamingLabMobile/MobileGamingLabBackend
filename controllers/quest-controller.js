var Quest = require("../models/quest");
var Content = require("../models/content");
var Game = require("../models/game");
var QuestEvent = require("../models/questEvent");

var questController = {};

error = function(res,message) {
	return res.json({
		success: false,
		message: message
	});
}

questController.newQuest = function(game_id, user_id, res) {
	nq = new Quest();
	
	Game.findOne({$and: [{_id: game_id},{ "metadata.owner": user_id}]}, function(err, game) {
		if (err) {
			return res.json({
				success: false,
				message: "Can't find game under given ID"
			});
		}
		
		if (!game) {
			return res.json({
				success: false,
				message: "No rights to create elements for this game."
			});
		}
		description = new Content();
		description.save();
		questEvent = new QuestEvent();
		questEvent.save();
		
		nq.description = description;
		nq.questEvent = questEvent;
		nq.save(function(err, quest) {
			game.components.quests.push(quest);
			
			game.save();
			
			quest.populate("description questEvent", function(err, q) {
				res.json({
					success: true,
					message: "New Quest successfully created.",
					quest: q
				});
			})
			
		});
	});
}

questController.getQuest = function(quest_id, res) {
	Quest.findById(quest_id).populate("requirements")
	.populate("description").populate("tasks")
	.populate("questEvent").exec(function(err, quest) {
		if (err || !quest) return res.json({
			success:false,
			message: "Can't fetch quest."
		});
		
		res.json({
			success:true,
			message: "Quest successfully fetched",
			quest: quest
		});
	})
}

questController.editQuest = function(quest_id,object,res) {
	Quest.findById(quest_id, function(err, quest){
		//take all the attributes of the input and push it into the db
		for (key in object) {
			value = object[key];
			if (value) { //only change if provided and not the same as stored
				if (value != quest[key]) {
					quest[key] = value;
				}
			}
			
			//if the quest is marked as initial add quest to initials in the game
			if (key =="initial") {
				if (value) {
					Game.find({"components.quests":quest._id}, function(err, games){
						var game = games[0];
						if (game.components.initialQuests.indexOf(quest._id) < 0) {
							game.components.initialQuests.push(quest);
							game.save();
						}
					});
				}
				
			}
		}
		quest.save(function(err) {
			if (err) return res.json({
				success:false,
				message: "Can't save Quest."
			});
		});
		res.json({
			success: true,
			message: "Quest successfully edited."
		});
	});
}

questController.linkTrigger = function(quest_id, trigger_id, res) {
	Quest.findByIdAndUpdate(
			quest_id,
			{
				$push: {"requirements": trigger_id}
			},
			{
				safe: true
			},
			function(err) {
				if (err) return error(res, "Can't add trigger to quest.");
				res.json({
					success: true,
					message: "Trigger successfully linked with quest."
				});
			}
	);
}


questController.unlinkTrigger = function(quest_id, trigger_id, res) {
	Quest.findByIdAndUpdate(
			quest_id,
			{
				$pull: {"requirements": trigger_id}
			},
			{
				safe: true
			},
			function(err) {
				if (err) return error(res, "Can't add trigger to quest.");
				
				res.json({
					success: true,
					message: "Trigger successfully unlinked with quest."
				});
			}
	);
}

questController.editDescription = function(quest_id, content,res) {
	Quest.findById(quest_id).populate("description").exec(function(err, quest) {
		if (!quest.description) {
			var description = new Content();
			for (var key in content) {
				description[key] = content[key];
			}
			description.save(function(err, content){
				quest.description = content;
			});
			
		} else {
			for (var key in content) {
				quest.description[key] = content[key];
			}
			quest.description.save();
		}
	
		quest.save(function(err,quest){
			res.json({
				success:true,
				message: "Description of quest successfully updated.",
				quest: quest
			})
		});
	});
}

questController.deleteQuest = function(qid, deep, res) {
	Quest.findById(qid).populate("description").populate("tasks").populate("requirements").
	populate("questEvent").exec(function(err, quest){
		if (err) return error(res, "Problems finding quest for delete operation.");
		if(!quest) return error(res, "Can't find quest to delete.");
		if (deep) {
			//remove all linkin
			if (quest.description)	quest.desription.remove();
			
			for (var i in quest.tasks) {
				quest.tasks[i].remove();
			}
			
			for (var i in quest.requirements) {
				quest.requirements[i].remove();
			}
			if (quest.questEvent) quest.questEvent.remove();
			
		} else {
			//just remove the quest not the trigger, event, interaction
			quest.description.remove();
		}
		Game.update({"components.quests": qid},
				{$pull : {
					"components.quests": qid
				}},
				{safe:true}, 
				function (err) {
					if (err) return error(res, "Can't remove quest from list in game object");
				});
		quest.remove(function(err) {
			if (err) return err(res, "Error whiling removing quest object.");
		});
		res.json({
			success: true,
			message: "Quest successfully deleted"
		})
		
	});
	
}

module.exports = questController;