// app/models/properties.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var user = rquire('./user.js');

// define the schema for our properties model
var propertiesSchema = mongoose.Schema({



});

// methods ======================
// create the model for properties
module.exports = mongoose.model('Properties', propertiesSchema);