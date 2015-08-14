// app/models/content.js
// define the schema for content model
var contentSchema = mongoose.Schema({

	name		:String,
	url			:String, //oder auch input?
	type		:String,
	html		: String

});

// methods ======================
// create the model for content
module.exports = mongoose.model('Content', contentSchema);