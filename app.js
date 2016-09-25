//require core external libraries
//"Require" is like "#include" in C for libraries in the code
var express = require('express') //Express - extracts HTTP requests (for socket.io or server)
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose'); //Mongoose - mangoDB that manages information for users 
var passport = require('passport'); //Passport - for sigining in through facebook or etc. 
var flash = require('connect-flash'); //Connect-flash - messaging to the client

//require helper libraries
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//database config file
var configDB = require('./config/database.js'); //Database has credentials and url to the database 

//setup port and host.
var port = 3000;
var host = 'localhost';

//setup database
mongoose.connect(configDB.url);//connect to our DB

//configure passport
require('./config/passport')(passport); //letting us call the function 

//setup express
//Use - associates the library with the applciation 
app.use(morgan('dev')); //log every request to the console - Morgan is a package that gives a descriptive console login
app.use(cookieParser()); //read cookies 
app.use(bodyParser()); //read html forms
app.use(express.static('public')); //if you have your own custom CSS 
app.set('view engine', 'ejs'); //setup ejs for templating

//setup passport
app.use(session({ secret: 'RavenclawAllDay'}));//session secret - for hashing 
app.use(passport.initialize()); 
app.use(passport.session()); //persistent login sessions
app.use(flash()); //use for flash messages - messaging the client

//setup routes
require('./app/routes.js')(app, passport); //requires a routes file (takes in application and the passport object)

//START THE SERVER
http.listen(port, function() {
	console.log("Listening on port " + port);
}) //listen will not return, it will set things up and then run its "Done" function 
