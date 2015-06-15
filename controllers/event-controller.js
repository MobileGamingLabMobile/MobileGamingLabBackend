var Quest = require("../models/quest");
var Content = require("../models/content");
var Action = require("../models/action");
var QuestEvent = require("../models/questEvent");

error = function(res, message) {
	return res.json({
		success: false,
		message: message
	});
}

var eventController = {};

eventController.newEvent = function(quest_id, res) {
	Quest.findById(quest_id).populate("questEvent").exec(function(err, quest){
		if (err || !quest) return error(res,"Can't fetch quest by its id.");
		
		event = new QuestEvent();
		event.save(function(err, event){
			quest.questEvent = event._id;
			quest.save();
			res.json({
				success: true,
				message: "Successfully created an empty event for the specified quest.",
				event : event
			})
		});
	});
}

eventController.getEvent = function(event_id,res) {
	QuestEvent.findById(event_id).populate("functions")
	.populate("sequence").exec(function(err, event) {
		if (err || !event) return error(res, "Can't fetch QuestEvent.");
		
		res.json({
			success:true,
			message: "QuestEvent successfully fetched",
			event: event
		});
	})
}

eventController.deleteEvent = function(event_id, res) {
	Quest.findOne({"questEvent":event_id}).populate("questEvent").exec(
			function(err, quest) {
				if (err) return error(res, "Can't fetch quest by nested quest event.");
				quest.questEvent.remove();
				quest.questEvent = null;
				quest.save();
				res.json({
					success:true,
					message:"Event was successfully deleted."
				});
			});
}


eventController.linkContent = function(event_id, content_id ,res) {
	QuestEvent.findByIdAndUpdate(
			event_id,
			{
				$push: {"sequence": content_id}
			},
			{
				safe: true
			},
			function(err) {
				if (err) return error(res, "Can't add content to event.");
				res.json({
					success: true,
					message: "Content successfully linked with event."
				});
			}
	);
}

eventController.unlinkContent = function(event_id, content_id ,res) {
	QuestEvent.findByIdAndUpdate(
			event_id,
			{
				$pull: {"sequence": content_id}
			},
			{
				safe: true
			},
			function(err) {
				if (err) return error(res, "Can't remove content from event.");
				res.json({
					success: true,
					message: "Content successfully unlinked from event."
				});
			}
	);
}

eventController.linkFunction = function(event_id, function_id ,res) {
	QuestEvent.findByIdAndUpdate(
			event_id,
			{
				$push: {"functions": functions_id}
			},
			{
				safe: true
			},
			function(err) {
				if (err) return error(res, "Can't add function to event.");
				res.json({
					success: true,
					message: "Function successfully linked with event."
				});
			}
	);
}

eventController.unlinkFunction = function(event_id, function_id ,res) {
	QuestEvent.findByIdAndUpdate(
			event_id,
			{
				$pull: {"functions": functions_id}
			},
			{
				safe: true
			},
			function(err) {
				if (err) return error(res, "Can't remove function from event.");
				res.json({
					success: true,
					message: "Function successfully unlinked from event."
				});
			}
	);
}

eventController.editEvent = function(event_id,object,res) {
	QuestEvent.findById(event_id, function(err, event){
		//take all the attributes of the input and push it into the db
		for (key in object) {
			value = object[key];
			if (value) { //only change if provided and not the same as stored
				if (value != object[key]) {
					event[key] = value;
				}
				
			}
		}
		event.save(function(err) {
			if (err) return res.json({
				success:false,
				message: "Can't save QuestEvent."
			});
			
			
		});
		res.json({
			success: true,
			message: "QuestEvent successfully edited."
		});
	});
}

module.exports = eventController;
