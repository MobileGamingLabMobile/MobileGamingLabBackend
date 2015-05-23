
/**
 * Module dependencies.
 */


// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
//var flash    = require('connect-flash');
var jwt 			= require('jwt-simple');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
//var session      = require('express-session');

var configDB = require('./config/database.js');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

//configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport,app,jwt); // pass passport for configuration

app.set('jwtTokenSecret','MUGLs_secret_TOKEN');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//app.use(express.static(__dirname + "/public")); //this is for public files like css / js / image
//app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(passport.initialize());
//app.use(flash()); // use connect-flash for flash messages stored in session
app.use(allowCrossDomain);
var jwtauth = require("./util/jwtauth.js")(jwt,app);
// routes ======================================================================
require('./routes/users.js')(app, passport,jwtauth); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);