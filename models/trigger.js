//app/models/trigger.js
var condition = require('./condition.js');

//define the schema for trigger model
var triggerSchema = mongoose.Schema({

    conditions	:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Condition'
    }],
	triggered	: {
		type: Boolean,
		default: false
	}

});

//create the model for trigger
triggerSchema.pre("remove", function(next) {
	for (var i = 0; i < this.conditions.length; i++){
		this.conditions[0].remove();
	}
	
	next();
})

module.exports = mongoose.model('Trigger', triggerSchema);
