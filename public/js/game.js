//Declare global page variable holder
var gameInfo = {};
gameInfo.gameIsLoading = false;//used to differentiate between a user leaving and the start of a game
//initialize the websocket
var socket = io();

//when the page is ready, get values for global page variables
$(document).ready(function() {
    gameInfo.username = $("#username").text();
    gameInfo.gameID = $("#gameID").text();

    gameInfo.currentPlayers = [];

    $(".player").each(function() {
        gameInfo.currentPlayers.push($(this).text());
    });

    console.log(gameInfo);//log info to the console for error checking

    //join game room and declare new player here
    socket.emit('join', gameInfo);
});

//function for showing / hiding the begin game button to the game creator
function updateStartGameButtonVisibility() {
    //find out if current user is the creator
    var isCreator = (gameInfo.username === gameInfo.gameID);
    //get number of players
    var numPlayers = gameInfo.currentPlayers.length;

    if (isCreator && (numPlayers >= minNumberOfPlayers)) {
        //this is the game creator and there are enough players. Show start game option
        $("#startGameButton").show();
    } else {
        //hide or keep hidden the startGameButton in all other cases
        $("#startGameButton").hide();
    }
}


window.onbeforeunload = function(event) {
    socket.emit('quitGame', gameInfo);
};

//Handle when a player cancels before the game can start
socket.on('quitGame', function(quiterInfo) {
    
});

