var userController = require("../controllers/user-controller.js");

module.exports = function(app, passport,jwtauth) {
	/*
	 * Hint: Every function in the execution chain carries the request and the request
	 * document. Respectively "req" and "res".
	 * The handling controller functions will use the response document to create the
	 * response message from there. This way it is easier to see which routes are stated
	 * and where they are handled.
	 */
	
	/**
	 * This function is used as  a middleware function in express for the login. It means
	 * that the request document (req), the response document (req) and the callback.
	 * function (next) are passed as parameters.
	 * @param req the request document
	 * @param res the response document
	 * @param next the callback function
	 */
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
	  
	 /**
	  * The signup function behaves as a express middleware function. It calls the
	  * assigned passport signup function.
	  */
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
    /**
     * This route listens on HTTP POST at "/login" and calls the implemented 
     * login function. The parameters are either passed in the request body as a JSON
     * object. In either case this object contains the parameters "success" (boolean)
     * and "message" (string). If the signup and login was successful then the object contains
     * also the parameters "token" (string) and "expires" (date).
     * 
     * @param email The email of the user as string
     * @param password The password of the user as string
     * @return JSON object
     */
      app.post('/login', login);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    /**
     * This route listens on HTTP POST at "/signup" and calls first the signup function
     * and if it is successful the login is called. The function return a JSON object 
     * to the client. In either case this object contains the parameters "success" (boolean)
     * and "message" (string). If the signup and login was successful then the object contains
     * also the parameters "token" (string) and "expires" (date).
     * 
     * @param email The email of the user as string
     * @param password The password of the user as string
     * @return JSON object
     */
    app.post('/signup', signup,login);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    /**
     * This route listens on HTTP GET at "/profile". For accessing the profile site
     * the user needs to be authenticated which is checked before the controller
     * function is called. For the authentication the access token is required that can be obtained after
     * the login. It can be stated either in the header under the parameter "x-access-token" or in the
     * document body at "access_token".
     * @param access_token The token obtained after login as string.
     */
    app.get('/profile', jwtauth.auth, function(req, res) {
    	userController.getOwnProfile(req.user._id, res);
    });
    	
    /**
     * This route listens on HTTP GET at "/profile/:uid" where the :uid needs to be replaces
     * by a valid user id. This route also needs authentication. This profile is the public
     * profile which can be accessed to all registered users.
     * 
     * @param access_token The token obtained after login as string.
     * @return JSON object
     */
    app.get('/profile/:uid', jwtauth.auth, function(req, res){
    	user_id = req.params.uid;
    	userController.getProfile(user_id, res);
    });
    // =====================================
    // Edit Profile ========================
    // =====================================
    /**
     * This function delegates the editProfile request to the designated controller class
     * 
     * @param access_token The token obtained after login as string.
     * @param operation Allowed values are "profile", "avatar" and "login" (avatar and login are not implemented at the moment)
     * @param name The name of the user (optional)
     * @param profession The profession of the user (optional)
     * @param country The country of a user (optional)
     * @param city The city of a user (optional)
     * @param JSONObject about the status
     */
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
    
    /**
     * This route delegates the request for a list of the owned games of a user.
     * 
     * @param access_token The token obtained after login as string.
     */
    app.get("/user/games/owned", jwtauth.auth,function(req, res) {
    	userController.getOwnedGames(req.user.id, res);
    });
    
    /**
     * This method delegates the request for all own subscribed games.
     * 
     * @param access_token The token obtained after login as string.
     * @return JSONObject
     */
    app.get("/user/games/subscribed", jwtauth.auth,function(req, res) {
    	userController.getSubscribedGames(req.user.id, res);
    });
    
    /**
     * This method delegates the request for retrieving all published games of a user.
     * @param access_token
     * @return JSONObject
     */
    app.get("/user/games/owned/:owner", jwtauth.auth,function(req, res) {
    	userController.getOwnedPublishedGames(req.params.owner, res);
    });
    
    /**
     * This method delegates the request for all subscribed games of an user.
     * @param access_token
     * @return JSONObject
     */
    app.get("/user/games/subscribed/:owner", jwtauth.auth,function(req, res) {
    	userController.getSubscribedGames(req.params.owner, res);
    });
    
    // =====================================
    // LOGOUT ==============================
    // =====================================
    /**
     * This function delegates the logout request.
     * 
     * @param access_token
     * @return JSONObject
     */
    app.post('/logout', jwtauth.auth, function(req, res) {
    	userController.logout(req.user._id,res);
    });
    
};
