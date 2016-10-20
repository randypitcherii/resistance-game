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
		//update the game with new game info
		socket.on('updateGame', function(gameInfo) {
			io.to(gameInfo.gameID).emit('updateGame', gameInfo);
		});

		//send vote
		socket.on('vote', function(voteInfo) {
			io.to(voteInfo.gameID).emit('vote', voteInfo);
		});

		//send mission status after a finished vote
		socket.on('votingResults', function(missionStatus) {
			io.to(missionStatus.gameID).emit('votingResults', missionStatus);
		});

		//handle when the game ends win
		socket.on("gameOver", function(info) {
			io.to(info.gameID).emit('gameOver', info);
		});
	});
};