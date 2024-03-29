var gameplay = require('../app/gameplay.js');
var Game = require('./models/game.js');

module.exports = function(app, passport) {
	//default
	app.get('/', isLoggedIn, function(req, res) {
		//if logged in, send to profile page, otherwise isLoggedIn will handle it
		res.redirect('/home');
	});

	/*
	//development helper to test game.ejs
	app.get('/', function(req, res) {
		var fakeUser = {}
		fakeUser.username = "fakeGame";
		fakeUser.currentGameID = "fakeGame";
		var fakePlayers = ["fakePlayer1", "fakePlayer2","fakePlayer3","fakePlayer4"];
		fakePlayers.push(fakeUser.username);
		res.render('game.ejs', {user: fakeUser, players: fakePlayers});
	});*/

	//homepage
	app.get('/home', isLoggedIn, function(req, res) {
		//if logged in, send to profile page, otherwise isLoggedIn will handle it
		res.render('home.ejs');
	});

	//profile
	//BUG-13
	app.get('/profile', /*isLoggedIn, */function(req, res) {
		//load signup page with any flash data if it exists
		res.render('profile.ejs', { user: req.user });
	});

	//createGame
	//BUG-16
	app.get('/createGame', /*isLoggedIn, */function(req, res) {
		//load createGame page
		gameplay.createGame(req, res, function(req, res, err, players){
			if (err) {
				throw err;
			}

			res.render('createGame.ejs', { user: req.user, isCreator: true, players: players});
		});
	});

	//join page
	//BUG-15
	app.get('/joinGame', /*isLoggedIn, */function(req, res) {
		//load join page 
		res.render('joinGame.ejs', {message: req.flash('joinMessage')});
	});

	//process game joining
	app.post('/joinGame', isLoggedIn, function(req, res) {
		gameplay.joinGame(req, res, function(req, res, err, wasFound, players){
			if (err) {
				throw err;
			}
			//continue to createGame room if game was found
			if (wasFound) {
				res.render('createGame.ejs', {user: req.user, isCreator: false, players: players});

			//if game was not found, redirect to join game again.
			} else {
				res.redirect('/joinGame');
			}
		});
	});

	//start game
	//BUG-14
	app.get('/startGame', /*isLoggedIn, */function(req, res) {
		Game.findOne({'gameID': req.user.currentGameID}, function(err, thisGame) {
			if (thisGame) {
				res.render('game.ejs', {user: req.user, players: thisGame.players});
				//BUG-25
				//thisGame.remove();//no longer need to store this game
			//if game doesn't exist, inform client
			} else {
				req.flash('joinMessage', 'Game was not found. Try again.');
				res.redirect('/joinGame');
			}
		});
	});

	//login
	app.get('/login', function(req, res) {
		//load login page with any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	//process login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}));

	//signup
	app.get('/signup', function(req, res) {
		//load signup page with any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	//process signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : 'signup',
		failureFlash : true
	}));

	//logout
	app.get('/logout', isLoggedIn, function(req, res) {
		req.user.save(function(err) {
			req.logout();
			res.redirect('/');
		});		
	});

	//function for checking user is logged in
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}

		//if not authenticated, redirect to login page
		res.render('home.ejs');//load login page
	}
};