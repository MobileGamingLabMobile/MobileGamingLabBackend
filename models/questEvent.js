// app/models/questEvent.js
var Action = require('./action.js');


// define the schema for questEvent model
var questEventSchema = mongoose.Schema({
	title : String,
	actions	:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Action'
	}],
	sequence	: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Content'
	}]
});

// methods ======================
// create the model for questEvent
questEventSchema.pre("remove",function(next){
	for (var  j = 0; j < this.sequence.length; j++) {
		var sequence = this.sequence[j];
		sequence.remove();
	}

	for (var  j = 0; j < this.actions.length; j++) {
		var action = this.actions[j];
		action.remove();
	}
	
	next();
})

module.exports = mongoose.model('QuestEvent', questEventSchema);