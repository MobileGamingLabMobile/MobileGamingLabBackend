// app/models/player.js
var mongoose = require('mongoose');

var item = require('./item.js');
var role = require('./role.js');
var group = require('./group.js');
var resource = require('./resource.js');
var properties = require('./properties.js');

// define the schema for player model
var playerSchema = mongoose.Schema({

	inventar		:{
		enabled		:Boolean,
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
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Resource'
	}],
	groups			:[{
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Group'
	}],
	properties		: {
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'ObjectProperty'
	}
});

// methods ======================
// create the model for player
module.exports = mongoose.model('Player', playerSchema);