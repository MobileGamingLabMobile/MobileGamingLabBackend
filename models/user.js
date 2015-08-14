// app/models/user.js
// load the things we need
var bcrypt   = require('bcrypt-nodejs');
var game    = require('./game');

// define the schema for our user model
var userSchema = mongoose.Schema({

    profile			: { //all of that can be edited on the profile site, at registration just the credentials matter
    	name		: String,
    	profession	: String,
    	country		: String,
    	city		: String,
    	avatar		: Buffer
    },

    login                       : {
        email                   : {
            type                : String, //mandatory
            unique              : true,
            required            : true
        }, //mandatory for registration
        password                : {
        	type : String,
        	required : true
        },
        registration            : Date, //will be set on registration
        session_key             : String, //will be set on login and removed on logout
        last                    : Date //will be set on login
    },

    games           :{
        owned       : [{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Game'
		}], // array of the games the user has product or is producing
        subscribed  : [{
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Game'
		}], // array of the games the user has subscribed
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.login.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
