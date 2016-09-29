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
	var testCredential = 'testUser';

	//setup fresh server before each test
	beforeEach(function(done) {
		server.restartAsync().then(done);
	});

	afterEach(function(done) {
		this.timeout(10000);
		//remove test user from database
		function(done){
			User.findOne({'username': testCredential}, function(err, user) {
				should.not.exist(err);
				//remove the user if it is found
				if(user) {
					console.log('got here');
					user.remove(done);
				}
			});
		}(done);
	});

	//successful registration--------------------------------------------------------------
	it('should pass testcase register-00', function() {
		this.timeout(10000);
		
		//try to login with invalid credentials
		request.post({url: appURL + '/signup', form:{ username: testCredential, password: testCredential}}, 
		function (err, response, body) {
			//assert that server responded with a redirect to login
			body.should.endWith('profile');
			done();
		});
	});//-----------------------------------------------------------------------------

	//invalid username--------------------------------------------------------------
	it('should pass testcase register-01', function() {

	});//-----------------------------------------------------------------------------

	//invalid password--------------------------------------------------------------
	it('should pass testcase register-02', function() {

	});//-----------------------------------------------------------------------------

	//username too large--------------------------------------------------------------
	it('should pass testcase register-03', function() {

	});//-----------------------------------------------------------------------------

	//password too large--------------------------------------------------------------
	it('should pass testcase register-04', function() {

	});//-----------------------------------------------------------------------------
});//========================================================================



//========================================================================
//Logout functionality
//========================================================================
describe('==== logout ====', function() {
  it('should pass testcase logout-00', function() {
    
  });
});//========================================================================



//========================================================================
//Game creation functionality
//========================================================================
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



//========================================================================
//Join game functionality
//========================================================================
describe('==== joinGame ====', function() {
  it('should pass testcase joinGame-00', function() {
    
  });

  it('should pass testcase joinGame-01', function() {
    
  });

  it('should pass testcase joinGame-02', function() {
    
  });
});//========================================================================



//========================================================================
//End game functionality
//========================================================================
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



//========================================================================
//server start functionality
//========================================================================
describe('==== startServer ====', function() {
  it('should pass testcase startServer-00', function() {
    
  });

  it('should pass testcase startServer-01', function() {
    
  });
});//========================================================================



//========================================================================
//Leadership functionality
//========================================================================
describe('==== leadership ====', function() {
  it('should pass testcase leadership-00', function() {
    
  });

  it('should pass testcase leadership-01', function() {
    
  });

  it('should pass testcase leadership-02', function() {
    
  });
});//========================================================================



//========================================================================
//Group selection functionality
//========================================================================
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



//========================================================================
//Mission functionality
//========================================================================
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



