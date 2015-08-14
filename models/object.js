// app/models/object.js
var item = require('./item.js');
var resource = require('./resource.js');
var player = require('./player.js');
var properties = require('./properties.js');

// define the schema for object model
var objectSchema = mongoose.Schema({
	item		:{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Item'
	},
	resource	:{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Resource'
	},
	player		:{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Player'
	},
	properties	:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'ObjectProperty'
		}]
});

// methods ======================
// create the model for object
module.exports = mongoose.model('Object', objectSchema);