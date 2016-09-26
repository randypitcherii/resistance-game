//require core external libraries
var express = require('express')
var app = express();
var http = require('http').Server(app);
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

//require helper libraries
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//database config file
var configDB = require('./config/database.js');

//setup port and host.
var port = 3000;
var host = 'localhost';

//setup database
mongoose.connect(configDB.url);//connect to our DB

//configure passport
require('./config/passport')(passport);

//setup express
app.use(morgan('dev')); //log every request to the console
app.use(cookieParser()); //read cookies
app.use(bodyParser()); //read html forms
app.use(express.static('public'));
app.set('view engine', 'ejs'); //setup ejs for templating
app.use(express.static('public'));

//setup passport
app.use(session({ secret: 'RavenclawAllDay'}));//session secret
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash()); //use for flash messages

//setup routes
require('./app/routes.js')(app, passport);

app.use(express.static(__dirname + '/views'));

var numUsers = 0;

//establish socket listener
io.on('connection', function(socket) {
	socket.on('join', function(username) {
		socket.join(gameID);
	});

   var addedUser = false;
  console.log('user has been connected');
  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
    console.log('user has been connected');
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});




//start the server.
http.listen(port, function() {
	console.log("Listening on port " + port);
});