//include testing libraries
var should = require('should');//assertion library https://github.com/shouldjs/should.js
var Promise = require('bluebird');//used to convert callback funtions to promise functions
var request = Promise.promisifyAll(require('request'));//used to make HTTP request to test server


//database connection
var mongoose = require('mongoose');
mongoose.Promise = Promise;//use bluebird promises

//include resistance-game libraries
var User = require('../app/models/user.js');//user object schema
var Game = require('../app/models/game.js');//game object schema
var gameplay = require('../app/gameplay.js');//game interaction

//define global testing variables
var appURL = 'http://localhost:3000';//base url for the running server
var server = Promise.promisifyAll(require('../app.js'));//used to instantiate new servers.

//========================================================================
//Login functionality
//========================================================================
describe('==== login ====', function() {
	//setup fresh server before each test
	beforeEach(function(done) {
		server.restartAsync().then(done);
	});


	//successful login--------------------------------------------------------------
	it('should pass testcase login-00', function(done) {
		this.timeout(10000);
		var testUser = new User();

		//add user info
		testUser.username = "testEntry";
		testUser.password = testUser.generateHash("testEntry");


		//save user to db
		testUser.save()
		.then(function() {
			//try to login with valid credentials
			request.post({url: appURL + '/login', form:{ username: "testEntry", password: "testEntry"}}, 
				function (err, response, body) {
					//assert that server responded with a redirect to profile
					should.not.exist(err);
					should.exist(body);
					body.should.endWith('profile');
					//remove test user from DB
					testUser.remove(done);
				});
		});
	});//-----------------------------------------------------------------------------

	//unsuccessful login--------------------------------------------------------------
	it('should pass testcase login-01', function(done) {
		this.timeout(10000);
		
		//try to login with invalid credentials
		request.post({url: appURL + '/login', form:{ username: "missingEntry", password: "missingEntry"}}, 
			function (err, response, body) {
				//assert that server responded with a redirect to login
				body.should.endWith('login');
				done();
			});
	});//-----------------------------------------------------------------------------

	//successful FB login--------------------------------------------------------------
	it('should pass testcase login-02', function() {
		//not implemented
	});//-----------------------------------------------------------------------------

	//unsuccessful FB login--------------------------------------------------------------
	it('should pass testcase login-03', function() {
		//not implemented
	});//-----------------------------------------------------------------------------
});//========================================================================



//========================================================================
//Registration functionality
//========================================================================
describe('==== register ====', function() {
	//setup fresh server before each test
	beforeEach(function(done) {
		server.restartAsync().then(done);
	});

	//remove test user from the database after this test set
	after(function(done) {
		this.timeout(10000);
		//remove test user from database
		User.findOne({'username': "testUser"}, function(err, user) {
			should.not.exist(err);
			//remove the user if it is found
			if(user) {
				user.remove(done);
			} else {
				//just return now
				done();
			}
		});
	});

	//successful registration--------------------------------------------------------------
	it('should pass testcase register-00', function(done) {
		this.timeout(10000);
		
		//try to create account with valid credentials
		request.post({url: appURL + '/signup', form:{ username: "testUser", password: "testPassword"}}, 
		function (err, response, body) {
			//assert that server responded with a redirect to profile
			body.should.endWith('profile');
			done();
		}.bind({done: done}));
	});//-----------------------------------------------------------------------------

	//invalid username--------------------------------------------------------------
	it('should pass testcase register-01', function(done) {
		this.timeout(10000);
		
		//try to create a new account with the same username
		request.post({url: appURL + '/signup', form:{ username: "testUser", password: "newTestPassword"}}, 
		function (err, response, body) {
			//assert that server responded with a redirect to signup
			body.should.endWith('signup');
			done();
		}.bind({done: done}));
	});//-----------------------------------------------------------------------------

	//invalid password--------------------------------------------------------------
	it('should pass testcase register-02', function(done) {
		//try to create a new account with a new username and an empty password
		request.post({url: appURL + '/signup', form:{ username: "newTestUsername", password: ""}}, 
		function (err, response, body) {
			//assert that server responded with a redirect to signup
			body.should.endWith('signup');
			done();
		}.bind({done: done}));
	});//-----------------------------------------------------------------------------

	//username too large--------------------------------------------------------------
	it('should pass testcase register-03', function(done) {
		//try to create a new account with a massive username
		var namePart = "1234567890";
		var massiveUsername = namePart + namePart + namePart + namePart + namePart + namePart;//60 chars long
		request.post({url: appURL + '/signup', form:{ username: massiveUsername, password: "testPassword"}}, 
		function (err, response, body) {
			//assert that server responded with a redirect to signup
			body.should.endWith('signup');
			done();
		}.bind({done: done}));
	});//-----------------------------------------------------------------------------

	//password too large--------------------------------------------------------------
	it('should pass testcase register-04', function(done) {
		//try to create a new account with a massive password
		var pwPart = "1234567890";
		var massivePassword = pwPart + pwPart + pwPart + pwPart + pwPart + pwPart;//60 chars long
		request.post({url: appURL + '/signup', form:{ username: "lastTestUser", password: massivePassword}}, 
		function (err, response, body) {
			//assert that server responded with a redirect to signup
			body.should.endWith('signup');
			done();
		}.bind({done: done}));
	});//-----------------------------------------------------------------------------
});//========================================================================



//========================================================================
//Logout functionality
//========================================================================
describe('==== logout ====', function(done) {
	//setup fresh server before each test
	beforeEach(function(done) {
		server.restartAsync().then(done);
	});

	//successful logout--------------------------------------------------------------
	it('should pass testcase logout-00', function(done) {
		//simply send a logout get request and ensure user is redirected home
		request(appURL, function(err, response, body){
			body.should.endWith("</html>");//end of home page file
			done();
		}.bind({done: done}));
	});//-----------------------------------------------------------------------------
});//========================================================================



//========================================================================
//Game creation functionality
//========================================================================
/*
describe('==== createGame ====', function() {
	it('should pass testcase createGame-00', function() {

	});

	it('should pass testcase createGame-01', function() {

	});

	it('should pass testcase createGame-02', function() {

	});

	it('should pass testcase createGame-03', function() {

	});
});//========================================================================
*/


//========================================================================
//Join game functionality
//========================================================================
/*
describe('==== joinGame ====', function() {
	it('should pass testcase joinGame-00', function() {

	});

	it('should pass testcase joinGame-01', function() {

	});

	it('should pass testcase joinGame-02', function() {

	});
});//========================================================================
*/


//========================================================================
//End game functionality
//========================================================================
/*
describe('==== endGame ====', function() {
	it('should pass testcase endGame-00', function() {

	});

	it('should pass testcase endGame-01', function() {

	});

	it('should pass testcase endGame-02', function() {

	});

	it('should pass testcase endGame-03', function() {

	});

	it('should pass testcase endGame-04', function() {

	});
});//========================================================================
*/


//========================================================================
//server start functionality
//========================================================================
describe('==== startServer ====', function() {
	//server starts successfully --------------------------------------------------------------
	it('should pass testcase startServer-00', function(done) {
		//if a connection does not timeout, good to go.
		server.restartAsync().then(done);//if something goes wrong, done won't execute
	});//-----------------------------------------------------------------------------

	//server responds to requests--------------------------------------------------------------
	it('should pass testcase startServer-01', function(done) {
		//any response will be acceptable 
		request(appURL, function(err, res, body) {
			should.not.exist(err);
			should.exist(body);
			done();
		}.bind({done: done}));
	});//-----------------------------------------------------------------------------
});//========================================================================



//========================================================================
//Leadership functionality
//========================================================================
/*
describe('==== leadership ====', function() {
	it('should pass testcase leadership-00', function() {

	});

	it('should pass testcase leadership-01', function() {

	});

	it('should pass testcase leadership-02', function() {

	});
});//========================================================================
*/


//========================================================================
//Group selection functionality
//========================================================================
/*
describe('==== groupSelect ====', function() {
	it('should pass testcase groupSelect-00', function() {

	});

	it('should pass testcase groupSelect-01', function() {

	});

	it('should pass testcase groupSelect-02', function() {

	});

	it('should pass testcase groupSelect-03', function() {

	});
});//========================================================================
*/


//========================================================================
//Mission functionality
//========================================================================
/*
describe('==== mission ====', function() {
	it('should pass testcase mission-00', function() {

	});

	it('should pass testcase mission-01', function() {

	});

	it('should pass testcase mission-02', function() {

	});

	it('should pass testcase mission-03', function() {

	});

	it('should pass testcase mission-04', function() {

	});

	it('should pass testcase mission-05', function() {

	});

	it('should pass testcase mission-06', function() {

	});
});//========================================================================

*/

