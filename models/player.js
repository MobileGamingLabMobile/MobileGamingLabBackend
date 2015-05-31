// app/models/player.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var item = rquire('./item.js');
var role = rquire('./role.js');
var group = rquire('./group.js');
var resource = rquire('./resource.js');
var properties = rquire('./properties.js');

// define the schema for player model
var playerSchema = mongoose.Schema({

	inventar		:{
		enabled		:Boolean,
		capacity	:[item.id]
	},

	role			:{
		roleName	:role.id
	},

	position		:[double, double], //GPS postion
	resource		:[resource.id],
	groups			:[group.id],
	properties		:properties.id
});

// methods ======================
// create the model for player
module.exports = mongoose.model('Player', playerSchema);