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
    finished :Boolean
});
//methods ======================
questSchema.plugin(deepPopulate);

//create the model for quest
module.exports = mongoose.model('Quest', questSchema);