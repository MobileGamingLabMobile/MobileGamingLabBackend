// app/models/role.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for role model
var roleSchema = mongoose.Schema({


});

// methods ======================
// create the model for role
module.exports = mongoose.model('Role', roleSchema);