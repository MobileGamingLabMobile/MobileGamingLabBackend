var Quest = require("../models/quest");

var questController = {};

questController.newQuest = function(game_id, user_id, res) {
	nq = new Quest();
	
	game.findOne({$and: [{_id: game_id},{ "metadata.owner": user_id}]}, function(err, game) {
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
		
		nq.save(function(err, quest) {
			game.quests.push(quest._id);
			game.save();
			
			res.json({
				success: true,
				message: "New Quest successfully created.",
				quest: quest
			});
		});
		
	});
}

questController.getQuest = function(quest_id, res) {
	Quest.findById(quest_id).populate("requirements")
	.populate("questDescription").populate("tasks")
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

module.exports = questController;