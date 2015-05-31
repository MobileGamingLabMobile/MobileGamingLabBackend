// app/models/input.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for input model
var inputSchema = mongoose.Schema({
	code		:String
	//qrCode		:, <- weglassen?!?
	//gesture		:, <- weglassen?!?
});

// methods ======================
// create the model for input
module.exports = mongoose.model('Input', inputSchema);