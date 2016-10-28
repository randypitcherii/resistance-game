//Declare global page variable holder
var gameInfo = {};
var username = "";
var userHasVoted = false;//keeps track of whether or not this user has voted
var isGameOwner = false;
var votingResults = [];//used to store votes
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

    //setup button listeners
    $("#selectMissionMembersButton").click(function(){
        //BUG-12
        $("#missionSelectionModal").modal(/*{backdrop: "static"}*/);
    });

    $("#teamInfoButton").click(function(){
        if (gameInfo.spies.length > 0) {
            var isSpy = false;
            for (i = 0; i < gameInfo.spies.length; i++) {
                if (username === gameInfo.spies[i]){
                    isSpy = true;
                }
            } 

            if(isSpy) {
                //BUG-24 part 1 of 2
                alert("You're on one of the teams or whatever.");
                //alert("You are a spy.");
            } else {
                //BUG-24 part 2 of 2
                alert("You're on one of the teams or whatever.");
                //alert("You are a resistance member.");
            }
        }
    });
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
    gameInfo.missionMembers = [];
    gameInfo.currentlyVoting = false;
    gameInfo.currentLeaderIndex = 0;
    gameInfo.startNewRound = true;
    gameInfo.numRejectedMissionsIAR = 0;//IAR=in a row. 5 or more and spies win

    //get spies
    var numPlayers = gameInfo.players.length;
    var numSpies = Math.ceil(numPlayers / 3.0);
    //BUG-23 part 1 of 2
    //shuffle(gameInfo.players);//randomize player order
    gameInfo.spies = [];//spies array
    while (numSpies > 0) {
        gameInfo.spies.push(gameInfo.players[numSpies]);
        numSpies--;
    }

    //reshuffle players again to avoid leader order giving away the spies
    //BUG-23 part 2 of 2
    //shuffle(gameInfo.players);

    //send game info to all players
    setTimeout(function() {
        socket.emit("updateGame", gameInfo);
    }, 1000);//pause for a second to allow other players time to load
}

//get and handle updated game info 
socket.on("updateGame", function(updatedInfo) {
    gameInfo = updatedInfo;//copy all info
    console.log("updated game info is:")
    console.log(gameInfo);//log info to the console for error checking

    //update page with the latest game info
    $("#currentLeader").text(gameInfo.players[gameInfo.currentLeaderIndex]);
    $("#currentRound").text(gameInfo.currentRound);
    $("#rejectedMissionsIAR").text(gameInfo.numRejectedMissionsIAR);
    $("#resistanceScore").text(gameInfo.resistancePoints);
    $("#spiesScore").text(gameInfo.spiesPoints);

    //start new round if necessary
    if(gameInfo.startNewRound) {
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

        gameInfo.startNewRound = false;//reset startNewRound
        socket.emit("updateGame", gameInfo);
    }

    //handle voting if currently voting
    if(gameInfo.currentlyVoting) {
        //open voting modal if current user is one of the mission members
        if (username === gameInfo.missionMembers[0] || username === gameInfo.missionMembers[1]) {
            if (!userHasVoted) {
                //show voting modal and record that the user has voted
                userHasVoted = true;
                $(".modal").modal('hide');
                //BUG-07
                $("#missionVoteModal").modal(/*{backdrop: "static"}*/);
            }
        }
    } else {
        userHasVoted = false;//resets the userHasVoted field in between votes
    }

    //end game if someone has won
    if (gameInfo.spiesPoints >= 3 || gameInfo.numRejectedMissionsIAR >= 5) {
        socket.emit("gameOver", {winners: "spies"});
    } else if (gameInfo.resistancePoints >= 3) {
        socket.emit("gameOver", {winners: "resistance"});
    }
});

//start the mission selection process
function missionSelectionVote() {
    var member0 = $("#missionMember0").val();
    var member1 = $("#missionMember1").val();

    //check the validity of the members
    /*BUG-04 | BUG-05
    if (member0 === member1 || member0 === null || member1 ===null) {
        alert("Select 2 different players for this mission.");
        return;//nothing else to do.
    }*/

    //reset selects
    $("#missionMember0").prop('selectedIndex',0);
    $("#missionMember1").prop('selectedIndex',0);

    //the members are valid. Continue to voting modal
    gameInfo.missionMembers.push(member0, member1);
    $(".modal").modal('hide');
    //BUG-06
    $("#startMissionVoteResultsModal").modal(/*{backdrop: "static"}*/);
}

//a mission has been proposed and voted in favor of. Start the mission
function startMission() {
    //hide the modal, update game info, and emit updateGame signal
    $(".modal").modal('hide');
    gameInfo.numRejectedMissionsIAR = 0;//reset this
    gameInfo.currentlyVoting = true;//set game state to voting
    socket.emit("updateGame", gameInfo);
}

//a mission has been proposed and voted against. Skip the mission
function skipMission() {
    //hide the modal, update the game, and start next round
    $(".modal").modal('hide');
    gameInfo.numRejectedMissionsIAR += 1;//increment this
    gameInfo.currentLeaderIndex = (gameInfo.currentLeaderIndex + 1) % gameInfo.players.length
    gameInfo.missionMembers = [];
    gameInfo.startNewRound = true;

    socket.emit('updateGame', gameInfo);
}

//send a vote to pass the mission
function voteMissionPass() {
    //hide the modal, send vote
    $(".modal").modal('hide');
    var vote = {username: username, vote: "pass", gameID: gameInfo.gameID}
    socket.emit("vote", vote);
}

//send a vote to fail the mission
function voteMissionFail() {
    //hide the modal, send vote
    $(".modal").modal('hide');
    var vote = {username: username, vote: "fail", gameID: gameInfo.gameID}
    socket.emit("vote", vote);
}

//Handle incoming votes
socket.on('vote', function(voteInfo) {
    if (!isGameOwner) {
        return;//only game owner handles this
    }

    if (votingResults.length === 0) {
        votingResults.push(voteInfo);//add first vote
        return;
    }

    if (votingResults[0].username === voteInfo.username) {
        return;//nothing to do if a user somehow votes twice
    }

    votingResults.push(voteInfo);//add second vote
    var votes = []
    votes.push(votingResults[0].vote, votingResults[1].vote)

    if (votes[0] === "fail" || votes[1] === "fail") {
        socket.emit("votingResults", {votes: votes, missionPasses: false, gameID: gameInfo.gameID});
    } else {
        socket.emit("votingResults", {votes: votes, missionPasses: true, gameID: gameInfo.gameID});
    }
});

//handle a finished vote
socket.on("votingResults", function(missionStatus) {
    if (isGameOwner) {
        //update game info and start new round
        gameInfo.currentRound += 1;
        gameInfo.missionMembers = [];
        gameInfo.currentlyVoting = false;
        gameInfo.currentLeaderIndex = (gameInfo.currentLeaderIndex + 1) % gameInfo.players.length;
        gameInfo.startNewRound = true;
        gameInfo.numRejectedMissionsIAR = 0;

        if (missionStatus.missionPasses) {
            gameInfo.resistancePoints += 1;
        } else {
            gameInfo.spiesPoints += 1;
        }

        socket.emit("updateGame", gameInfo);
    }

    //clear votes
    votingResults = [];

    //inform client of vote results
    var vote0 = missionStatus.votes[0]
    var vote1 = missionStatus.votes[1]

    if (vote0 !== vote1) {
        alert("The mission has failed. There was one vote for pass and one vote for fail.");
    } else if (vote0 === "pass") {
        alert("The mission has passed. There were two votes for pass.");
    } else {
        alert("The mission has failed. There were two votes for fail.")
    }

});


window.onbeforeunload = function(event) {
    if (!gameIsOver) {//prevents onbeforeunload callback from firing another gameOver
        //BUG-19
        //socket.emit("gameOver", {gameID: gameInfo.gameID, winners: 'none', quitter: username});
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
