//Declare global page variable holder
var gameInfo = {};
var username = "";
var isGameOwner = false;
var isCurrentLeader = false;
var gameIsOver = false;
//initialize the websocket
var socket = io();


//when the page is ready, get values for global page variables
$(document).ready(function() {
    username = $("#username").text();
    gameInfo.gameID = $("#gameID").text();
    isGameOwner = (username === gameInfo.gameID);

    gameInfo.players = [];

    $(".player").each(function() {
        gameInfo.players.push($(this).text());
    });

    console.log("locally calculated game info is:")
    console.log(gameInfo);//log info to the console for error checking

    //join game room 
    socket.emit('join', gameInfo);
    init();//initialize game

    //setup modal listener
    $("#selectMissionMembersButton").click(function(){
        $("#missionSelectionModal").modal({backdrop: "static"});
    });

    $("#selectMissionMembersButton").click();
});

//the game owner is responsible for initializing the game
function init() {
    if (!isGameOwner) {
        return;//nothing to do if not game owner
    }

    //set basic initial game info
    gameInfo.currentRound = 1;
    gameInfo.resistancePoints = 0;
    gameInfo.spiesPoints = 0;
    gameInfo.currentMissionMembers = [];
    gameInfo.startMissionVotes = [];
    gameInfo.passMissionVotes = [];
    gameInfo.currentLeaderIndex = 0;
    gameInfo.numRejectedMissionsIAR = 0;//IAR=in a row. 5 or more and spies win

    //get spies
    var numPlayers = gameInfo.players.length;
    var numSpies = Math.ceil(numPlayers / 3.0);
    shuffle(gameInfo.players);//randomize player order
    gameInfo.spies = [];//spies array
    while (numSpies > 0) {
        gameInfo.spies.push(gameInfo.players[numSpies]);
        numSpies--;
    }

    //reshuffle players again to avoid leader order giving away the spies
    shuffle(gameInfo.players);

    //send game info to all players
    socket.emit("updateGame", gameInfo);
}

//get and handle updated game info 
socket.on("updateGame", function(initialized_gameInfo) {
    gameInfo = initialized_gameInfo;//copy all info
    console.log("updated game info is:")
    console.log(gameInfo);//log info to the console for error checking

    //update page with the currentLeader
    $("#currentLeader").text(gameInfo.players[gameInfo.currentLeaderIndex]);
    if (username === gameInfo.players[gameInfo.currentLeaderIndex]) {
        $("#selectMissionMembersButton").removeClass('hide');//the leader may use this button
    } else {
        $("#selectMissionMembersButton").addClass('hide');//all others may not use this button
    }

    if (gameInfo.spiesPoints === 3 || gameInfo.numRejectedMissionsIAR === 5) {
        socket.emit("gameOver", {gameID: gameInfo.gameID, winners: 'spies'});
    } else if (gameInfo.resistancePoints === 3) {
        socket.emit("gameOver", {gameID: gameInfo.gameID, winners: 'resistance'});
    }
});

//start the mission selection process
function missionSelectionVote() {

}


window.onbeforeunload = function(event) {
    if (!gameIsOver) {//prevents onbeforeunload callback from firing another gameOver
        socket.emit("gameOver", {gameID: gameInfo.gameID, winners: 'none', quitter: username});
    }
};

//Handle when a gameOver signal is received. Either a team has won or someone quit
socket.on('gameOver', function(info) {
    gameIsOver = true;
    if (info.winners === 'spies') {
        alert("The spies have won!");
    } else if (info.winners === 'resistance') {
        alert("The resistance has won!");
    } else {
        //someone must have quit
        if (username === info.quitter) {
            return;//nothing to do
        }
        alert(info.quitter + " has quit the game. Game over.");
    }

    //redirect user to profile
    window.location.href = "/profile";
});

//function for shuffling an array from stackoverflow
//http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}
