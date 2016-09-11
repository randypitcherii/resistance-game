//get current user and game ID for this session
var name = $("#currentUser").text();
var gameID = $("#gameID").text();

//initialize the keyboard controls
var inputType = {};
inputType.left = keyboard(37);
inputType.up = keyboard(38);
inputType.right = keyboard(39);
inputType.down = keyboard(40);
inputType.enter = keyboard(13);
inputType.backspace = keyboard(8);
inputType.space = keyboard(32);
inputType.button_f = keyboard(70);

//initialize move object for sending move to server
var moveObject = {};
moveObject.name = name;
moveObject.move = ""; //initial value.
moveObject.gameID = gameID;

//the following two attributes are updated on every positional button release
//and sent to the server to ensure synchronization of positions across games
moveObject.xPosition = -1;//initial value
moveObject.yPosition = -1;//initial value

//initialize game over object for sending game over to server
var gameoverObject = {};
gameoverObject.name = name;
gameoverObject.gameID = gameID;
gameoverObject.sourceMessage = "";//initial value
gameoverObject.externalMessage = "";//initial value

//initialize the websocket
var socket = io();

//join room with gameID
socket.emit('join', gameID);

//create socket input handler.
//moveCommand has same structure as moveObject
socket.on('move', function(moveCommand) {
    var tankToMove;
    var isLocal;
    //check which tank to move. If name matches moveCommand name, move tankA
    if (moveCommand.name === name) {
        tankToMove = tankA;
        isLocal = true;
    } else {
        tankToMove = tankB;
        isLocal = false;
    }

    //send the command to the tankMovement.js file for processing
    handleCommand(tankToMove, isLocal,moveCommand.move,  moveCommand);
});

//create socket game over handler
socket.on('gameover', function(gameoverObject) {
    if (gameoverObject.name === name) {
        //game over came from local game instance
        g.state = end(gameoverObject.sourceMessage);  
    } else {
        //opponent sent game over
        g.state = end(gameoverObject.externalMessage);  
    }
});

/**
 * This function adds event listeners to keyboard input
 */
function createKeyboardInputListeners() {
    //handle the left arrow key press
    inputType.left.press = function() {
        moveObject.move = moveset.left;
        moveObject.xPosition = tankA.x;
        moveObject.yPosition = tankA.y;
        socket.emit('move', moveObject);
    }

    //handle the left arrow key release
    inputType.left.release = function() {
        moveObject.move = moveset.leftRelease;
        moveObject.xPosition = tankA.x;
        moveObject.yPosition = tankA.y;
        socket.emit('move', moveObject);
    }

    //handle the up press
    inputType.up.press = function() {
        moveObject.move = moveset.up;
        moveObject.xPosition = tankA.x;
        moveObject.yPosition = tankA.y;
        socket.emit('move', moveObject);
    }

    //handle the up release
    inputType.up.release = function() {
        moveObject.move = moveset.upRelease;
        moveObject.xPosition = tankA.x;
        moveObject.yPosition = tankA.y;
        socket.emit('move', moveObject);
    }

    //handle the right press
    inputType.right.press = function() {
        moveObject.move = moveset.right;
        moveObject.xPosition = tankA.x;
        moveObject.yPosition = tankA.y;
        socket.emit('move', moveObject);
    }

    //handle the right release
    inputType.right.release = function() {
        moveObject.move = moveset.rightRelease;
        moveObject.xPosition = tankA.x;
        moveObject.yPosition = tankA.y;
        socket.emit('move', moveObject);
    }

    //handle the down press
    inputType.down.press = function() {
        moveObject.move = moveset.down;
        moveObject.xPosition = tankA.x;
        moveObject.yPosition = tankA.y;
        socket.emit('move', moveObject);
    }

    //handle the down release
    inputType.down.release = function() {
        moveObject.move = moveset.downRelease;
        moveObject.xPosition = tankA.x;
        moveObject.yPosition = tankA.y;
        socket.emit('move', moveObject);
    }

    //handle the enter press
    inputType.enter.press = function() {
        moveObject.move = moveset.enter;
        socket.emit('move', moveObject);
    }

    //handle the backspace press
    inputType.backspace.press = function() {
        moveObject.move = moveset.backspace;
        socket.emit('move', moveObject);
    }

    //handle the space press
    inputType.space.press = function() {
        moveObject.move = moveset.space;
        socket.emit('move', moveObject);
    }

    //handle the button_f press
    inputType.button_f.press = function() {
        moveObject.move = moveset.button_f;
        socket.emit('move', moveObject);
    }
}

/**
 * This function adds event listeners for mobile input. The event listeners are the
 * same functions used for callbacks on keyboard input events. So simple.
 *
 * @param mobileInputs - collection of mobile button objects for game input on mobile.
 */
function createMobileInputListeners(mobileInputs) {
    mobileInputs.forward.press = inputType.up.press;
    mobileInputs.forward.release = inputType.up.release;
    mobileInputs.left.press = inputType.left.press;
    mobileInputs.left.release = inputType.left.release;
    mobileInputs.right.press = inputType.right.press;
    mobileInputs.right.release = inputType.right.release;
    mobileInputs.down.press = inputType.down.press;
    mobileInputs.down.release = inputType.down.release;
    mobileInputs.background.press = inputType.space.press;
    mobileInputs.changeAmmo.press = inputType.button_f.press;
}

/**
 * This function creates the event listeners for sending
 * movement commands to the server from keypresses and mobile inputs.
 *
 * @param mobileInputs - collection of mobile button objects for game input on mobile.
 */
function initTankControls(mobileInputs) {
    //wire up those callback functions to event listeners.
    createKeyboardInputListeners();
    createMobileInputListeners(mobileInputs);
}
