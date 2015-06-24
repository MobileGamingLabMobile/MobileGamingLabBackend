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
	if(err) throw (err);
	if(trigger[0].conditions.length==0){
	     trigger[0].setTriggered(true,function(err){
		 if(err)throw (err);
		 callback(false,trigger[0]);
	     });
		
	     }
	 else{
	     callback(true,null);
	 }
    
    });


};
triggerSchema.methods.setTriggered=function(bool,callback) {
    this.triggered=bool;
    this.save(callback);
};

//create the model for trigger
module.exports = mongoose.model('Trigger', triggerSchema);
