// app/models/properties.js

// define the schema for our properties model
var propertiesSchema = mongoose.Schema({
	name : String,
	value: String,
	type: String
});

// methods ======================
// create the model for properties
module.exports = mongoose.model('ObjectProperty', propertiesSchema);