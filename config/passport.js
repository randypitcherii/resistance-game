//import passport-local dependency
var localStrategy = require('passport-local').Strategy;

//get user model
var User = require('../app/models/user');

module.exports = function(passport) {
	//session setup
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});


	//signup
	passport.use('local-signup', new localStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	},

	function(req, username, password, done) {
		process.nextTick(function() {
			//find user if they exist
			User.findOne({'username' : username}, function(err, user) {
				if (err) {
					//return error if any found
					return done(err);
				}
				if (user) {
					//user already exists
					return done(null, false, req.flash('signupMessage', 'That username already exists'));
				} else {
					//username is available
					var newUser = new User();

					//add user info
					newUser.username = username;
					newUser.password = newUser.generateHash(password);
					newUser.currentGameID = "";

					//save user
					newUser.save(function(err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}));


	//login
	passport.use('local-login', new localStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	},
	function (req, username, password, done) {
		//find user
		User.findOne({
			'username' : username
		}, function(err, user) {
			//handle errors, if any
			if (err) {
				return done(err);
			}

			//if no user found, deal with it here
			if (!user) {
				return done(null, false, req.flash('loginMessage', 'Username not found.'));
			}

			//deal with wrong password
			if (!user.validPassword(password)) {
				return done(null, false, req.flash('loginMessage', 'Incorrect password.'));
			}

			return done(null, user);
		});
	}));
};