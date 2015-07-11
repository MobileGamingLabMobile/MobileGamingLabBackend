/**
 * Module dependencies.
 */
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
//var port     = process.env.PORT || 8080;
var port     = 8080;
mongoose = require('mongoose');
var passport = require('passport');
//var flash    = require('connect-flash');
var jwt 			= require('jwt-simple');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
//var session      = require('express-session');

var gameEngine = require("http").createServer(express);
var gameEnginePort = 3030;
 io = require("socket.io")(gameEngine);


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

/*
 * configuration of DB, JWT and Passport
 */
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport,app,jwt); // pass passport for configuration
app.set('jwtTokenSecret','MUGLs_secret_TOKEN');


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

/*
 * public directory (for websites and similar content) 
 */
app.use(express.static(__dirname + "/public")); //this is for public files like css / js / image
app.set('views', __dirname + '/views');
app.engine(".html", require('ejs').renderFile); //use EJS to render HTML files

app.use(passport.initialize()); // required for passport
app.use(allowCrossDomain);


/*
 * routes
 */
var jwtauth = require("./util/jwtauth.js")(jwt,app);
require('./routes/users.js')(app, passport,jwtauth);
require('./routes/editor.js')(app, jwtauth); 
require('./routes/game.js')(app, jwtauth);


/**
*Logger
**/
 log4js = require('log4js');
 log4js.loadAppender('file');
 log4js.addAppender(log4js.appenders.file('config/logging.json'), 'engine');
 
/**
* Sockets
**/
//set up the socket channels and functions
require("./sockets/engine")(io,jwtauth);
//require("./lib/Objects3.js");
channel={"Groups":"Groups","InventarItems":"InventarItems","MapItems":"MapItems","Player":"Player","quest":"Quests","Roles":"Roles","Sequences":"Sequences"};

/*
 * Start up Express Server
 */
app.listen(port);
gameEngine.listen(gameEnginePort);
console.log('The magic happens on port ' + port);
