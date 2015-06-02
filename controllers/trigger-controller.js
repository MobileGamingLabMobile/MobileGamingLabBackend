var Quest = require("../models/quest");
var Trigger = require("../models/trigger");
var triggerController = {};

triggerController.newTrigger = function(res) {
	t = new Trigger();
	t.save(function(err, trigger) {
		if (err || !trigger) {
			return res.json({
				success: true,
				message: "Can't create new trigger."
			});
		}
		res.json({
			success: true,
			message: "An empty trigger was created.",
			trigger: trigger
		});
	});
}

triggerController.getTrigger = function(trigger_id, res) {
	Trigger.findById(trigger_id).populate("conditions").exec(function(err, trigger){
		if (err || !trigger) {
			return res.json({
				success: true,
				message: "Can't retrieve trigger from database."
			});
		}
		res.json({
			succes: true,
			message: "Trigger successfully loaded."
		});
	});
}

triggerController.linkCondition = function(trigger_id, condition_id, res) {
	Trigger.findByIdAndUpdate(
			trigger_id,
			{
				$push: {"conditions": condition_id}
			},
			{
				safe: true
			},
			function(err) {
				if (err) return error(res, "Can't add condition to trigger.");
				res.json({
					success: true,
					message: "Condition successfully linked with trigger."
				});
			}
	);
}

triggerController.unlinkCondition = function(trigger_id, condition_id,res) {
	Trigger.findByIdAndUpdate(
			trigger_id,
			{
				$pull: {"conditions": condition_id}
			},
			{
				safe: true
			},
			function(err) {
				if (err) return error(res, "Can't add condition to trigger.");
				
				res.json({
					success: true,
					message: "Condition successfully unlinked with trigger."
				});
			}
	);
}

module.exports = triggerController;
