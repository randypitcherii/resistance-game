//functions that provide for game functionality
var Game = {}

Game.createGame = function(req, res, done) {
	req.user.currentGameID = req.user.username;
	req.user.save(function(err) {
		done(req, res, err);
	});
}

module.exports = Game;

