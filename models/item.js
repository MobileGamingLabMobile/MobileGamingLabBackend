// app/models/item.js
var functions = require('./action.js');

// define the schema for item model
var itemSchema = mongoose.Schema({

	actions		:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Action'
	}],
	name			:String,
	position		:[Number, Number],
	icon			:String

});

// methods ======================
// create the model for item
module.exports = mongoose.model('Item', itemSchema);