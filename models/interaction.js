// app/models/interaction.js
var mongoose = require('mongoose');

var trigger = require('./trigger.js');
var functions = require('./functions.js');

// define the schema for interaction model
var interactionSchema = mongoose.Schema({
	trigger		:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Trigger'
	}],
	actions :[{
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Action'
	    }]
});

// methods ======================
// create the model for interaction

interactionSchema.methods.testTriggerFalseExists=function(callback){
    var interaction=this;
    return this.model('Interaction').find({'_id':this._id}).populate('trigger','triggered',{triggered:false}).exec(function(err,interaction){
	if(interaction[0].trigger.length==0){
		 callback(err,false,interaction);
	     }
	 else{
	     callback(err,true,interaction);
	 }
    });
};
interactionSchema.methods.interact=function(){
    this.model('Interaction').find({'_id':this._id}).populate('actions').exec(
	    function(err,interaction){
		var actionList=interaction[0].actions;
	
		for(var i =0;i<actionList.length;i++){
		    actionList[i].execute(function(err){});
		}
	    });
};


module.exports = mongoose.model('Interaction', interactionSchema);