// config/passport.js

// load all the things we need

var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport, app,jwt) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
	        // if there is no user with that email
	        // create the user
	        var newUser            = new User();
	
	        // set the user's local credentials
	        newUser.login.email    = email;
	        newUser.login.password = newUser.generateHash(password);
	        newUser.login.registration = Date.now();
	
	        // save the user
	        newUser.save(function(err) {
	            if (err) {
	            	done(null,false,{
	                	success : false,
	                	message: "That email is already taken."
            		});
	        	} else {
        	        done(null, newUser);
            	}
	        });
	        
        //});
    }));
    
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
    	
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'login.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, {success: false, message: 'No user found.'}); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, {success: false, message: 'Oops! Wrong password.'}); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            var moment = require('moment');
		    var expires = moment().add(7,'days').valueOf();
		    var token = jwt.encode({
		    	iss: user.id,
		    	exp: expires
	    	}, app.get('jwtTokenSecret'));

            user.login.last = Date.now();
            user.login.session_key = token;
            
            user.save(function (err) {
            	if (err) {
            		return done(null,false, {success: false, message :"Can't save user to database."});
            	}
            })
            
            return done(null, {
	    		token : token,
	    	  	expires: expires,
	    	  	success : true, 
	    	  	message : "Login successful."
	    	});
        });

    }));

};
