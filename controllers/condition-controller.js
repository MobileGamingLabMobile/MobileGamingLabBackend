var Condition = require("../models/condition");
var Trigger = require("../models/trigger");
var conditionController = {};

error = function(res,message) {
	return res.json({
		success: false,
		message: message
	});
}

conditionController.newCondition = function(type,res) {
	c = new Condition();
	c.type = type;
	c.save(function(err, condition){
		if (err) return error(res, "Database error while searching for condition.");
		
		res.json({
			success: true,
			message: "Empty condition created.",
			condition: condition
		});
	});
}

conditionController.modifyCondition = function(condition_id, object, res) {
	Condition.findById(condition_id, function(err, condition) {
		conditionType = object.type;
		if (!conditionType) {
			return res.json({
				success: false,
				message: "Malformed input object \"type\" doesn't match."
			})
		}
		innerCondition = object[conditionType];
		
		if (condition[conditionType]) { //if there already is an object, then loop through and check for updates
			ct = condition[conditionType];
			//loop through the new object and write substitute changes
			for(key in innerCondition) {
				if (!ct[key] && innerCondition[key] && innerCondition[key] != "") {
					ct[key] = innerCondition[key];
				}
			}
		} else { //there is nothing then just add the object
			condition[conditionType] = innerCondition;
		}
		condition.save(function(err){
			if (err) return error(res, "Database problem while saving modifications on condition");
			
			res.json({
				success: true,
				message: "Condition successfully modified"
			});
		});
	});
}

conditionController.getCondition = function(condition_id, res) {
	Condition.findById(condition_id, function(err, condition) {
		if (err) {
			return res.json({
				success: false,
				message: "Database error while searching for condition."
			});
		}
		res.json({
			success: true,
			message: "Condition found and returned.",
			condition: condition
		})
	})
}

conditionController.getAllConditionsByType=function(type,res){
Condition.find({ 'type': type}, function (err, conditions) {
 if( err || !conditions) {
        console.log("No Condition found");
    } else {            
        res.conditions=conditions;
    };
});

}
module.exports = conditionController;
