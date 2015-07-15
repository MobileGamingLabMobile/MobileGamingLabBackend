// app/models/interaction.js
var trigger = require('./trigger.js');
var action = require('./action.js');

// define the schema for interaction model
var interactionSchema = mongoose.Schema({
	trigger		:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Trigger'
	}],
	actions	:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Action'
	}]
});

// methods ======================
// create the model for interaction

interactionSchema.methods.interact=function(client_key,progress){
    var logger=log4js.getLogger("models");
    logger.setLevel("ERROR");
    
    logger.trace('interaction.interact executed');
    this.model('Interaction').findById(this._id).populate('actions').exec(
	    function(err,interaction){
			var actionList=interaction.actions;
			for(var i =0;i<actionList.length;i++){
			    actionList[i].execute(client_key,progress,function(err,object){});
			}
			progress.finishInteraction(interaction._id);
	    });
    	
};

interactionSchema.pre("remove",function(next){
	for (var k = 0; k < this.trigger.length; k++) {
		var trigger = this.trigger[k];
		trigger.remove();
	}
	//action
	for (var k = 0; k < this.actions.length; k++) {
		var action = this.actions[k];
		action.remove();
	}
	next();
})


module.exports = mongoose.model('Interaction', interactionSchema);