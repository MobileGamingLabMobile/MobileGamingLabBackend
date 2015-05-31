// app/models/group.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var player = rquire('./player.js');
var item = rquire('./item.js');
var properties = rquire('./properties.js');

// define the schema for group model
var groupSchema = mongoose.Schema({
	member		:[player.id],
	properties	:properties.id,

	inventar		:{
		enabled		:Boolean,
		solts		:[item.id]
	}
});

// methods ======================
// create the model for group
module.exports = mongoose.model('Group', groupSchema);