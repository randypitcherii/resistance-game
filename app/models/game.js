//load dependencies
var mongoose = require('mongoose');

//setup database schema
var gameSchema = mongoose.Schema({
	gameID : String,
	players : [String],
	isInProgress : Boolean,
	currentLeaderID : String
}, {collection : 'resistance_games'});

//expose mongoose model to the app
module.exports = mongoose.model('Game', gameSchema);