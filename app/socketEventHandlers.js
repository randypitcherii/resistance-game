module.exports = function(io) {
	//establish socket listener
	io.on('connection', function(socket) {
		//========================================================================
		//General socket events
		//========================================================================
		//add socket to the gameID communication channel
		socket.on('join', function(gameInfo) {
			console.log(gameInfo.username + " is joining " + gameInfo.gameID);
			socket.join(gameInfo.gameID);
		});//========================================================================

		
		//========================================================================
		//create game events
		//========================================================================
		//emit new player name to all clients in this channel
		socket.on('newPlayer_join', function(gameInfo) {
			console.log(gameInfo.username + " is a new player in " + gameInfo.gameID);
			io.to(gameInfo.gameID).emit('newPlayer_join', gameInfo.username);
		});

		//emit new player name to all clients in this channel
		socket.on('newPlayer_remove', function(gameInfo) {
			io.to(gameInfo.gameID).emit('newPlayer_remove', gameInfo.username);
		});

		//Emit the startGame signal to all clients when game leader starts game
		socket.on('startGame', function(gameInfo) {
		    io.to(gameInfo.gameID).emit('startGame', gameInfo);
		});//========================================================================


		//========================================================================
		//gameplay events
		//========================================================================
		socket.on('initializeGame', function(gameInfo) {
			console.log(gameInfo.username + " has initialized a new game with the following properties:");
			console.log(gameInfo);
			io.to(gameInfo.gameID).emit('initializeGame', gameInfo);
		});
	});
};