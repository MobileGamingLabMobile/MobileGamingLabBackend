var User = require('../models/user');
var jwt = require('jwt-simple');
 
module.exports = function(jwt,app) {
	jwtauth = {};
	
	/**
	 * This function fetches the client token and the secret token and passes it to the jwt decoding
	 * function.
	 * 
	 * @param token The token send from the client
	 */
	jwtauth.decode = function(token) {
		return jwt.decode(token, app.get('jwtTokenSecret'));
	}
	
	/**
	 * Checks the token for validity.
	 * 
	 * @param token The token as send from the client
	 * @param callback The callback function (message_object, succes)
	 */
	jwtauth.checkToken = function(token, callback) {
		var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
	    if (decoded.exp <= Date.now()) {
	    	return callback({message:"Token has expired."},false);
		}
	    User.findById(decoded.iss, function(err, user) {
	    	if (err) return callback({message:"Token invalid. No such user."},false);
	    	
	    	callback(null, true);
		});
	}
	
	/**
	 * This function will be used as a middleware function in most of the HTTP request in order
	 * to have an authentication. Middleware function are set up by stating the request, the response 
	 * and the callback function. During this function a JSON Web Token (JWT) will be decoded and
	 * checked against the database.
	 * To hand over the access token you can either use the KVP "x-access-token" as part of the header 
 	 * or you send it as a query parameter or as part of the request body with the KVP "access_token".
 	 * On success it will call the "next" function (usually the following function in the route)
	 * 
	 * @param req The request document
	 * @param res The response document
	 * @param next The callback function if the function was successfull
	 */
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