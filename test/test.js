var assert = require('assert');
var should = require('should');

//========================================================================
//this is a sample of code for testing an Array
//========================================================================
describe('Array', function() {
  describe('#indexOf()', function() {
  	//using assert library
    it('should return -1 when the value is not present (asserts).', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });

    //using should library
    it('should return -1 when the value is not present (shouldjs)', function() {
      [1,2,3].indexOf(4).should.equal(-1);
    });
  });
});//========================================================================



//========================================================================
//Login functionality
//========================================================================
describe('==== login ====', function() {
  describe('login-00', function() {
    
  });

  describe('login-01', function() {
    
  });

  describe('login-02', function() {
    
  });

  describe('login-03', function() {
    
  });
});//========================================================================



//========================================================================
//Registration functionality
//========================================================================
describe('==== register ====', function() {
  describe('register-00', function() {
    
  });

  describe('register-01', function() {
    
  });

  describe('register-02', function() {
    
  });

  describe('register-03', function() {
    
  });

  describe('register-04', function() {
    
  });
});//========================================================================



//========================================================================
//Logout functionality
//========================================================================
describe('==== logout ====', function() {
  describe('logout-00', function() {
    
  });
});//========================================================================



//========================================================================
//Game creation functionality
//========================================================================
describe('==== createGame ====', function() {
  describe('createGame-00', function() {
    
  });

  describe('createGame-01', function() {
    
  });

  describe('createGame-02', function() {
    
  });

  describe('createGame-03', function() {
    
  });
});//========================================================================



//========================================================================
//Join game functionality
//========================================================================
describe('==== joinGame ====', function() {
  describe('joinGame-00', function() {
    
  });

  describe('joinGame-01', function() {
    
  });

  describe('joinGame-02', function() {
    
  });
});//========================================================================



//========================================================================
//End game functionality
//========================================================================
describe('==== endGame ====', function() {
  describe('endGame-00', function() {
    
  });

  describe('endGame-01', function() {
    
  });

  describe('endGame-02', function() {
    
  });

  describe('endGame-03', function() {
    
  });

  describe('endGame-04', function() {
    
  });
});//========================================================================



//========================================================================
//server start functionality
//========================================================================
describe('==== startServer ====', function() {
  describe('startServer-00', function() {
    
  });

  describe('startServer-01', function() {
    
  });
});//========================================================================



//========================================================================
//Leadership functionality
//========================================================================
describe('==== leadership ====', function() {
  describe('leadership-00', function() {
    
  });

  describe('leadership-01', function() {
    
  });

  describe('leadership-02', function() {
    
  });
});//========================================================================



//========================================================================
//Group selection functionality
//========================================================================
describe('==== groupSelect ====', function() {
  describe('groupSelect-00', function() {
    
  });

  describe('groupSelect-01', function() {
    
  });

  describe('groupSelect-02', function() {
    
  });

  describe('groupSelect-03', function() {
    
  });
});//========================================================================



//========================================================================
//Mission functionality
//========================================================================
describe('==== mission ====', function() {
  describe('mission-00', function() {
    
  });

  describe('mission-01', function() {
    
  });

  describe('mission-02', function() {
    
  });

  describe('mission-03', function() {
    
  });

  describe('mission-04', function() {
    
  });

  describe('mission-05', function() {
    
  });

  describe('mission-06', function() {
    
  });
});//========================================================================



