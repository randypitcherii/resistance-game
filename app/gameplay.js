//load game schema
var Game = require('./models/game.js');

//game interaction interface
var gameplay = {}

gameplay.createGame = function(req, res, done) {
	req.user.currentGameID = req.user.username;
	req.user.save(function(err) {
		if (err) {
			return done(req, res, err, null);
		}

		//try to find already existing game
		Game.findOne({'gameID': req.user.currentGameID}, function(err, thisGame) {
			if (thisGame) {
				thisGame.players = [req.user.username];
				
				thisGame.save(function(err) {
					done(req, res, err, thisGame.players);
				});

			//if game doesn't exist, inform client
			} else {
				//instantiate new game
				newGame = new Game();

				//add game info
				newGame.gameID = req.user.currentGameID;
				newGame.players = [req.user.username];

				newGame.save(function(err) {
					done(req, res, err, newGame.players);
				});
			}
		});
	});
}

gameplay.joinGame = function(req, res, done) {
	gameID = req.body.gameID
	newUser = req.user;
	newUsername = newUser.username;

	Game.findOne({'gameID': gameID}, function(err, thisGame) {
		if (err) {
			return done(req, res, err, null, null);
		}

		//if game exists, add new player and save game
		//BUG: users can currently join active games!!!!
		if (thisGame) {
			//Add user to thisGame.players if not already there
			notFound = -1
			if (thisGame.players.indexOf(newUsername) == notFound) {
				thisGame.players.push(newUsername);
			}

			//add gameID to user's info
			thisGameID = thisGame.gameID;
			thisGame.save(function(err) {
				if (err) {
					return done(req, res, err, null, null);
				}

				//update this user's profile with current gameID
				newUser.currentGameID = thisGameID;
				newUser.save(function(err){
					done(req, res, err, true, thisGame.players);
				});
			});

		//if game doesn't exist, inform client
		} else {
			req.flash('joinMessage', 'Game not found. Try again.');
			done(req, res, err, false, null);
		}
	});
}

//export to expose functionality
module.exports = gameplay;

