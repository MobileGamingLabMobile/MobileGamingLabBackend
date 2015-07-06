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
module.exports = mongoose.model('QuestEvent', questEventSchema);