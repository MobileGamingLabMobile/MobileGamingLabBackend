// app/models/scene.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var user = rquire('./user.js');

var trigger = rquire('./trigger.js');
var questCollection = rquire('./questCollection.js');
var questEvent = rquire('./questEvent.js');

// define the schema for our scene model
var sceneSchema = mongoose.Schema({
	questCollection	:[questCollection.id],
	trigger			:[trigger.id],
	questEvent		:questEvent.id
});

// methods ======================
// create the model for scene
module.exports = mongoose.model('Scene', sceneSchema);