// app/models/group.js
var player = require('./player.js');
var item = require('./item.js');
var properties = require('./properties.js');

// define the schema for group model
var groupSchema = mongoose.Schema({
	member		:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Player'
	}],
	properties	: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'ObjectProperty'
	}],

	inventar		:{
		enabled		:Boolean,
		slots		:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Item'
		}]
	}
});

// methods ======================
// create the model for group
module.exports = mongoose.model('Group', groupSchema);