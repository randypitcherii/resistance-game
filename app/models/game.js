//load dependencies
var mongoose = require('mongoose');

//setup database schema
var gameSchema = mongoose.Schema({
	gameID : String,
	players : [String]
}, {collection : 'resistance_games'});

//expose mongoose model to the app
module.exports = mongoose.model('Game', gameSchema);