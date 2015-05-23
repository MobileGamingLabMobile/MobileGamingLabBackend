var User = require('../models/user');

module.exports = function(app, passport,jwtauth) {
	 function login(req, res, next) {
	  	  passport.authenticate('local-login', function(err, token, info) {
			    if (err) {
			      return next(err); // will generate a 500 error
			    }
			    // Generate a JSON response reflecting authentication status
			    if (! token) {
			      return res.json({ 
			    	  success : false, 
			    	  message : info.message 
				  });
			    }
			    return res.json(token);	    
		  })(req,res,next);
	  }
	  
	  function signup(req,res,next){ 
	  	passport.authenticate('local-signup', function(err,user,info){
	  		if (err) {
	  			return res.json({
	    			success: false,
	    			message:"The user could not have been created."
	  			});
	  		}
	  		
	  		if(user) {
	  			return next();
	  		}
	  		
	  		return res.json(info);
	  		
	  	})(req, res, next);
	  }
    // =====================================
    // LOGIN ===============================
    // =====================================
    //process the login form
      app.post('/login', login);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // process the signup form
    app.post('/signup', signup,login);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', jwtauth.auth, function(req, res) {
    	User.findById(req.user._id,function(err, user) {
			if (err) {
				return res.json({
					success: false,
					message: "Private profile not available."
				});
			}
			var user = {};
			user.profile = req.user.profile;
			user.login = {};
			user.login.email = req.user.login.email;
			user.login.registration = req.user.login.registration;
			user.login.last = req.user.login.last;
			
			return res.json({
				success: true,
				message: "Private profile successfully loaded.",
				user: user
			});
    	});
    });
    	
    //public profile view with condition to be logged in
    app.get('/profile/:uid', jwtauth.auth, function(req, res){

		User.findById(req.params.uid, function(err, user) {
			if (err) {
				return res.json({
					success: false,
					message: "Public profile not available. Reason undefined."
				});
			}
			var resUser = {};
			resUser.profile = user.profile;
			
			return res.json({
				success: true,
				message: "Public profile successfully loaded.",
				user: resUser
			});
	    });
    });
    // =====================================
    // Edit Profile ========================
    // =====================================
    app.post('/profile', jwtauth.auth, function(req,res) {
    	var User = require('../models/user');
    	if (req.body.operation === 'profile') {
    		console.log("in operation profile")
    		User.findById(req.user._id, function (err, user){
        		var result = {};
        		if (err) {
        			result.message = err;
        		}
        		if (req.body.name != user.profile.name) {
        			req.user.profile.name = user.profile.name = req.body.name;
        		}
        		if (user.profile.profession != req.body.profession) {
        			req.user.profile.profession = user.profile.profession = req.body.profession;
        		}
        		if (user.profile.country != req.body.country) {
        			req.user.profile.country = user.profile.country = req.body.country;
        		}
        		if (user.profile.city != req.body.city) {
        			req.user.profile.city = user.profile.city = req.body.city;
        		}
        		var message = user.save(function(err){
        			if (err) {
        				result.message = "Can't change user.";
        			}
        		});
        		if (message) {
        			result.success = false;
        			result.message = message;
        		} else {
        			result.success = true;
        			
        			//don't return everything of the user
        			var selUser = {};
        			selUser.profile = req.user.profile;
        			selUser.login = {};
        			selUser.login.email = req.user.login.email;
        			selUser.login.last = req.user.login.last;
        			selUser.login.registration = req.user.login.registration;
        			
        			result.user = selUser;
        			result.message = "User successfully updated.";
        		}
        		return res.json(result);
        	});
    	}
    	
    	if (req.body.operation === 'avatar') {
    		return res.json({
    			success: false,
    			user : req.user,
    			message: "Upload of Avatar image not yet implemented."
    		});
    	}
    	
    	if (req.body.operation === 'login') {
    		return res.json({
    			success: false,
    			user : req.user,
    			message: "Changing login credentials is not yet implemented."
    		});
    	}
    });

    
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.post('/logout', jwtauth.auth, function(req, res) {
    	var User = require('../models/user');
    	User.findById(req.user._id,function(err, user) {
    		if (err) { 
			return res.json({
    				success: false,
    				message: err
			});
		}
    		
    		user.login.session_key = "";
    		user.save(function(err){
    			if (err) {
    				return res.json({
						success: false,
						message: "Can't delete session key at logout."
					});
    			}
    			
				res.json({
	    				success: true,
	    				message: "Successfully logged out."
				});
    		});
    	});
    });
    
    app.get('/loginTest', jwtauth.auth, function(req,res){
    	res.json({
    		message: "You did it!"
		});
    });
};
