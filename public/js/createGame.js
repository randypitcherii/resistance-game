//Declare global page variable holder
var gameInfo = {};
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

    //join game room and declare new player here
    socket.emit('join', gameInfo);
    socket.emit('newPlayer_join', gameInfo);
});

//function for updating html to update currentPlayers
function updateCurrentPlayersTable() {
    //remove all current players
    $(".player").remove();

    //append entry to currentPlayers div for each player in currentPlayers
    for (i = 0; i < gameInfo.currentPlayers.length; i++ ) {
        var player = $("<h3 class=\"player\"></h3>").text(gameInfo.currentPlayers[i]);
        $("#currentPlayers").append(player);
    }
}

//function for showing / hiding the begin game button to the game creator
function updateStartGameButtonVisibility() {
    //find out if current user is the creator
    var isCreator = (gameInfo.username === gameInfo.gameID);
    //get number of players
    var numPlayers = gameInfo.currentPlayers.length;

    if (isCreator && (numPlayers >= 5)) {
        //this is the game creator and there are enough players. Show start game option
        $("#startGameButton").show();
    } else {
        //hide or keep hidden the startGameButton in all other cases
        $("#startGameButton").hide();
    }
}

//Handle an incoming newPlayer signal
socket.on('newPlayer_join', function(newUsername) {
    //check if the new player is already in currentPlayers
    console.log("newPlayer_join from " + newUsername);
    if (gameInfo.currentPlayers.indexOf(newUsername) > -1) {
        return;// game already knows about new user, there's nothing to do
    }

    //to get here, newUsername must be new. 
    gameInfo.currentPlayers.push(newUsername);//update currentPlayers array
    updateCurrentPlayersTable();//update the html display to the user with the new player
    updateStartGameButtonVisibility();//show the startGame button if appropriate
});

//Handle when a player cancels before the game can start
socket.on('newPlayer_remove', function(newUsername) {
    //check if newUsername has already been removed from currentPlayers
    if (gameInfo.currentPlayers.indexOf(newUsername) === -1) {
        return;// game already removed the newUsername and handled the situation.
    }

    //to get here, newUsername must still be in currentPlayers. Remove it now.
    var indexToRemove = gameInfo.currentPlayers.indexOf(newUsername);
    gameInfo.currentPlayers.splice(indexToRemove, 1);//remove 1 entry at index=indexToRemove
    updateCurrentPlayersTable();//update the html display to the user with the new player
    updateStartGameButtonVisibility();//show the startGame button if appropriate
});

//Handle an incoming newPlayer signal
socket.on('startGame', function(gameInfo) {

});
