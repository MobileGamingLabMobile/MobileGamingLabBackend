//app/models/quest.js
var trigger = require('./trigger.js');
var content = require('./content.js');
var interaction = require('./interaction.js');
var questEvent = require('./questEvent.js');
var deepPopulate = require("mongoose-deep-populate");

//define the schema for quest model
var questSchema = mongoose.Schema({
    title: String,
    requirements :[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Trigger'
    }],
    description : {//wollten wir evtl als HTML realisieren, innerhalb von Content
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Content'
    },
    tasks :[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Interaction'
    }],
    questEvent :{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'QuestEvent'
    },
    available :Boolean,
    started :Boolean,
    finished :Boolean,
    initial: Boolean
});
//methods ======================
questSchema.plugin(deepPopulate);
questSchema.pre("remove",function(next){
	if (this.description) this.description.remove();
	if (this.questEvent) this.questEvent.remove();

	for (var j = 0; j < this.tasks.length; j++) {
		var interaction = this.tasks[j];
		interaction.remove();
	}
	//requirements
	for (var j = 0; j < this.requirements.length; j++) {
		var trigger = this.requirements[j];
		trigger.remove();
	}
	next();
});
//create the model for quest
module.exports = mongoose.model('Quest', questSchema);