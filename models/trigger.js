//app/models/trigger.js

var bcrypt   = require('bcrypt-nodejs');



//define the schema for trigger model
var triggerSchema = mongoose.Schema({

    conditions	:[{
	type:  mongoose.Schema.Types.ObjectId,
	ref: 'Condition'
    }],
    triggered	:Boolean

});

triggerSchema.methods.testConditionFalseExists=function(callback){
    return this.model('Trigger').find({'_id':this._id}).populate('conditions','fulfilled',{fulfilled:false}).exec(function(err,trigger){
	 if(trigger[0].conditions.length==0){
		 callback(err,false);
	     }
	 else{
	     callback(err,true);
	 }
    });


};
triggerSchema.methods.setTriggered=function(bool) {
    this.triggered=bool;
};

//create the model for trigger
module.exports = mongoose.model('Trigger', triggerSchema);
