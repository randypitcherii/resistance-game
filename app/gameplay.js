//functions that provide for game functionality
var Game = {}
Game.playerCount = 0;
Game.players = {};

Game.createGame = function(req, res, done) {
	req.user.currentGameID = req.user.username;
	req.user.save(function(err) {
		done(req, res, err);
	});
}

Game.addPlayer = function(req, res, username) {
	Game.players[playerCount] = username;
	playerCount++;
}

module.exports = Game;

