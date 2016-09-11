//load dependencies
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//setup database schema
var userSchema = mongoose.Schema({
	username : String,
	password : String,
	activeGame : Boolean,
	hasOpponent : Boolean
}, {collection : 'resistance_users'});

//method for hashing passwords
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(13), null);
};

//method for validating password
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}

//expose mongoose model to the app
module.exports = mongoose.model('User', userSchema);