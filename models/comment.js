// app/models/comment.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var user = rquire('./user.js');
var game = rquire('./game.js');

// define the schema for our comment model
// multiple comments for one game possible also by the same user
var commentSchema = mogoose.Schema({

	user	: user.id, // the user name making the comment
	game	: game.id, //the name of the game the comment is related to
	rating	: int, // rating for the game range 1-5 and 0 for not given
	time	: Date,
	text	: String // commenttext
});

// create the model for coment and expose it to our app
module.exports = mongoose.model('Comment', commentSchema);