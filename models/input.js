// app/models/input.js
// define the schema for input model
var inputSchema = mongoose.Schema({
	code		:String
	//qrCode		:, <- weglassen?!?
	//gesture		:, <- weglassen?!?
});

// methods ======================
// create the model for input
module.exports = mongoose.model('Input', inputSchema);