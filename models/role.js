// app/models/role.js
var mongoose = require('mongoose');

// define the schema for role model
var roleSchema = mongoose.Schema({
	name : String
});

// methods ======================
// create the model for role
module.exports = mongoose.model('Role', roleSchema);