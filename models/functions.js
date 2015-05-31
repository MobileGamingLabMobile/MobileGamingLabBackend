// app/models/functions.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var action = rquire('./action.js');

// define the schema for functions model
var functionsSchema = mongoose.Schema({
	action		:[action.id]
});

// methods ======================
// create the model for functions
module.exports = mongoose.model('Functions', functionsSchema);