// app/models/player.js
var item = require('./item.js');
var role = require('./role.js');
var group = require('./group.js');
var resource = require('./resource.js');
var properties = require('./properties.js');
var User = require("./user")

// define the schema for player model
var playerInstanceSchema = mongoose.Schema({

	inventar		:{
		enabled		:{
			type:Boolean,
			default: true
		},
		slot	:[{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Item'
		}]
	},

	role			:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Role'
	}],

	position		:{
		x:Number, //GPS postion
		y: Number,
		z: Number 
	},
	resource		:[{
		value		: Number,
		type		: {
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Resource'
		}
	}],
	groups			:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Group'
	}],
	properties		: [{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'ObjectProperty'
	}],
	user		: {
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

// methods ======================
// create the model for player
module.exports = mongoose.model('PlayerInstance', playerInstanceSchema);