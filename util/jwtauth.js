var User = require('../models/user');
var jwt = require('jwt-simple');
 
module.exports = function(jwt,app) {
	jwtauth = {};
	
	jwtauth.auth = function(req,res,next) {
		var token = (req.body && req.body.access_token) || 
		(req.query && req.query.access_token) || 
		req.headers['x-access-token'];
		
		if (token) {
		  try {
		    var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
		    if (decoded.exp <= Date.now()) {
		    	return res.json({
			    	success: false,
			    	message:  "Token has expired."
		    	});
			}
		    User.findById(decoded.iss, function(err, user) {
			  req.user = user;
			  next();
			});
		    
		  } catch (err) {
		    return res.json({
		    	success: false,
		    	message: "You are not logged in."
		    });
		  }
		} else {
			return res.json({
		    	success: false,
		    	message: "You are not logged in."
		    });
		}
	}
	
	return jwtauth;
};