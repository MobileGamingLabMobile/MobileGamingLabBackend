// app/models/comment.js


var user = require('./user.js');
var game = require('./game.js');

// define the schema for our comment model
// multiple comments for one game possible also by the same user
var commentSchema = mongoose.Schema({

	user	: {
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}, // the user name making the comment
	game	: {
		type:  mongoose.Schema.Types.ObjectId,
		ref: 'Game'
	}, //the name of the game the comment is related to
	rating	: Number, // rating for the game range 1-5 and 0 for not given
	time	: Date,
	text	: String // commenttext
});

// create the model for coment and expose it to our app
module.exports = mongoose.model('Comment', commentSchema);