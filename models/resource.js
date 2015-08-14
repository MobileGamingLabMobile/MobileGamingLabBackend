// app/models/resource.js
// define the schema for resource model
var resourceSchema = mongoose.Schema({

	value		: Number,
	name		: String,
	description	: String
	
});

// methods ======================
// create the model for object
module.exports = mongoose.model('Resource', resourceSchema);