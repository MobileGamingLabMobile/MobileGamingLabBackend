var userController = require("../controllers/user-controller.js");

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
    	userController.getOwnProfile(req.user._id, res);
    });
    	
    //public profile view with condition to be logged in
    app.get('/profile/:uid', jwtauth.auth, function(req, res){
    	user_id = req.params.uid;
    	userController.getProfile(user_id, res);
    });
    // =====================================
    // Edit Profile ========================
    // =====================================
    app.post('/profile', jwtauth.auth, function(req,res) {
    	var operation = req.body.operation;
    	if (operation == "profile") {
	    	var profile = {};
	    	if (req.body.name && req.body.name != "") {
				profile.name = req.body.name;
			}
			if (req.body.profession && req.body.profession != "") {
				profile.profession = req.body.profession;
			}
			if (req.body.country && req.body.country != "") {
				profile.country = req.body.country;
			}
			if (req.body.city && req.body.city != "") {
				profile.city = req.body.city;
			}
			userController.editProfile(req.user._id,profile, req, res);
    	}
    	
    	if (operation === 'avatar') {
    		return res.json({
    			success: false,
    			user : req.user,
    			message: "Upload of Avatar image not yet implemented."
    		});
    	}
    	
    	if (operation === 'login') {
    		return res.json({
    			success: false,
    			user : req.user,
    			message: "Changing login credentials is not yet implemented."
    		});
    	}
    });
    
    app.get("/user/games/owned", jwtauth.auth,function(req, res) {
    	userController.getOwnedGames(req.user.id, res);
    });
    
    app.get("/user/games/subscribed", jwtauth.auth,function(req, res) {
    	userController.getSubscribedGames(req.user.id, res);
    });
    
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.post('/logout', jwtauth.auth, function(req, res) {
    	userController.logout(req.user._id,res);
    });
    
};
