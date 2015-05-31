// app/models/object.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var item = rquire('./item.js');
var resource = rquire('./resource.js');
var player = rquire('./player.js');
var properties = rquire('./properties.js');

// define the schema for object model
var objectSchema = mongoose.Schema({
	item		:item.id,
	resource	:resource.id,
	player		:player.id,
	properties	:properties.id
});

// methods ======================
// create the model for object
module.exports = mongoose.model('Object', objectSchema);