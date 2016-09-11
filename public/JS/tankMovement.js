//set universal command types. All moves stored in 'moveset'
var moveset = {};
moveset.left = "leftMove";
moveset.leftRelease = "leftRelease";
moveset.up = "upMove";
moveset.upRelease = "upRelease";
moveset.right = "rightMove";
moveset.rightRelease = "rightRelease";
moveset.down = "downMove";
moveset.downRelease = "downRelease";
moveset.enter = "enter";
moveset.backspace = "backspace";
moveset.space = "space";
moveset.button_f = "f";

/**
 * This function handles the left arrow press for the specified tank object.
 *
 * @param tank - tank object to be moved
 * @param isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function leftMove(tank, isLocal, xPosition, yPosition) {
	if (isLocal) {
		tank.rotation = 270 / 180 * Math.PI; 
	    tank.vx = -5;
	    tank.vy = 0;
	} else {
		//the position coordinates from the opponent's instance of the current game
		//must be mirrored to align with the local instance of the game. Use the current game
		//background object to get the local width and height then calculate the updated local position
		tank.x = background.width - xPosition;
		tank.y = background.height - yPosition;

		tank.rotation = 0.5 * Math.PI;
        tank.vx = 5;
        tank.vy = 0;
	}
}

/**
 * This function handles the left arrow release for the specified tank object.
 *
 * @param tank - tank object to be moved
 * @param isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 * @param xPosition - the x coordinate of the opponent tank to be repositioned. This coordinate is with respect to the opponent's local game
 * @param yPosition - the y coordinate of the opponent tank to be repositioned. This coordinate is with respect to the opponent's local game
 */
function leftRelease(tank, isLocal, xPosition, yPosition) {
	tank.vx = 0;

	//if this is a non-local command, update the local position of the opponent tank to
	//maintain synchronization with the opponent's instance of the current game
	if(!isLocal) {
		//the position coordinates from the opponent's instance of the current game
		//must be mirrored to align with the local instance of the game. Use the current game
		//background object to get the local width and height then calculate the updated local position
		tankB.x = background.width - xPosition;
		tankB.y = background.height - yPosition;
	}
}

/**
 * This function handles the up arrow press for the specified tank object.
 *
 * @param tank - tank object to be moved
 * @param isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function upMove(tank, isLocal, xPosition, yPosition) {
	if (isLocal) {
		tank.rotation = 0;
        tank.vy = -5;
        tank.vx = 0;
	} else {
		tank.rotation = Math.PI;
        tank.vy = 5;
        tank.vx = 0;

		//the position coordinates from the opponent's instance of the current game
		//must be mirrored to align with the local instance of the game. Use the current game
		//background object to get the local width and height then calculate the updated local position
		tank.x = background.width - xPosition;
		tank.y = background.height - yPosition;
	}
}

/**
 * This function handles the up arrow release for the specified tank object.
 *
 * @param tank - tank object to be moved
 * @param isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 * @param xPosition - the x coordinate of the opponent tank to be repositioned. This coordinate is with respect to the opponent's local game
 * @param yPosition - the y coordinate of the opponent tank to be repositioned. This coordinate is with respect to the opponent's local game
 */
function upRelease(tank, isLocal, xPosition, yPosition) {
	tank.vy = 0;
	//if this is a non-local command, update the local position of the opponent tank to
	//maintain synchronization with the opponent's instance of the current game
	if(!isLocal) {
		//the position coordinates from the opponent's instance of the current game
		//must be mirrored to align with the local instance of the game. Use the current game
		//background object to get the local width and height then calculate the updated local position
		tankB.x = background.width - xPosition;
		tankB.y = background.height - yPosition;
	}
}

/**
 * This function handles the right arrow press for the specified tank object.
 *
 * @param tank - tank object to be moved
 * @param isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function rightMove(tank, isLocal, xPosition, yPosition) {
	if (isLocal) {
		tank.rotation = 0.5 * Math.PI;
        tank.vx = 5;
        tank.vy = 0;
	} else {
		//the position coordinates from the opponent's instance of the current game
		//must be mirrored to align with the local instance of the game. Use the current game
		//background object to get the local width and height then calculate the updated local position
		tank.x = background.width - xPosition;
		tank.y = background.height - yPosition;

		tank.rotation = 270 / 180 * Math.PI; 
	    tank.vx = -5;
	    tank.vy = 0;
	}
}

/**
 * This function handles the right arrow release for the specified tank object.
 *
 * @param tank - tank object to be moved
 * @param isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 * @param xPosition - the x coordinate of the opponent tank to be repositioned. This coordinate is with respect to the opponent's local game
 * @param yPosition - the y coordinate of the opponent tank to be repositioned. This coordinate is with respect to the opponent's local game
 */
function rightRelease(tank, isLocal, xPosition, yPosition) {
	tank.vx = 0;

	//if this is a non-local command, update the local position of the opponent tank to
	//maintain synchronization with the opponent's instance of the current game
	if(!isLocal) {
		//the position coordinates from the opponent's instance of the current game
		//must be mirrored to align with the local instance of the game. Use the current game
		//background object to get the local width and height then calculate the updated local position
		tankB.x = background.width - xPosition;
		tankB.y = background.height - yPosition;
	}
}

/**
 * This function handles the down arrow press for the specified tank object.
 *
 * @param tank - tank object to be moved
 * @param isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function downMove(tank, isLocal, xPosition, yPosition) {
	if (isLocal) {
		tank.rotation = Math.PI;
        tank.vy = 5;
        tank.vx = 0;
	} else {
		//the position coordinates from the opponent's instance of the current game
		//must be mirrored to align with the local instance of the game. Use the current game
		//background object to get the local width and height then calculate the updated local position
		tank.x = background.width - xPosition;
		tank.y = background.height - yPosition;

		tank.rotation = 0;
        tank.vy = -5;
        tank.vx = 0;
	}
}

/**
 * This function handles the down arrow release for the specified tank object.
 *
 * @param tank - tank object to be moved
 * @param isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function downRelease(tank, isLocal, xPosition, yPosition) {
	tank.vy = 0;
	//if this is a non-local command, update the local position of the opponent tank to
	//maintain synchronization with the opponent's instance of the current game
	if(!isLocal) {
		//the position coordinates from the opponent's instance of the current game
		//must be mirrored to align with the local instance of the game. Use the current game
		//background object to get the local width and height then calculate the updated local position
		tankB.x = background.width - xPosition;
		tankB.y = background.height - yPosition;
	}
}

/**
 * This function handles the enter button press for the specified tank object.
 *
 * @param tank - tank object to be moved
 * @param isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function enterMove(tank, isLocal) {
}

/**
 * This function handles the backspace button press for the specified tank object.
 *
 * @param tank - tank object to be moved
 * @param isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function backspaceMove(tank, isLocal) {
}

/**
 * This function handles the space button press for the specified tank object.
 *
 * @param tank - tank object to be moved
 */
function spaceMove(tank) {
	fire(tank);
}

/**
 * This function handles the F press for the specified tank object.
 *
 * @param tank - tank object to switch the ammo flag for.
 */
function f_buttonMove(tank) {
	tank.switch_ammo_flag *= -1;
}

/**
 * This function dispatches the incoming command from the server to the
 * correct handler function.
 *
 * @param tank - the tank being handled in this command
 * @param isLocal - boolean: true if command is for local tank, false otherwise
 * @param command - string that stores the move to execute
 * @param commandObject - full command object from server with attributes needed to execute some moves
 */
function handleCommand(tank, isLocal, command, commandObject) {
	if (command === moveset.left) {
		leftMove(tank, isLocal, commandObject.xPosition, commandObject.yPosition);
	} else if (command === moveset.leftRelease) {
		leftRelease(tank, isLocal, commandObject.xPosition, commandObject.yPosition);
	} else if (command === moveset.up) {
		upMove(tank, isLocal, commandObject.xPosition, commandObject.yPosition);
	} else if (command === moveset.upRelease) {
		upRelease(tank, isLocal, commandObject.xPosition, commandObject.yPosition);
	} else if (command === moveset.right) {
		rightMove(tank, isLocal, commandObject.xPosition, commandObject.yPosition);
	} else if (command === moveset.rightRelease) {
		rightRelease(tank, isLocal, commandObject.xPosition, commandObject.yPosition);
	} else if (command === moveset.down) {
		downMove(tank, isLocal, commandObject.xPosition, commandObject.yPosition);
	}  else if (command === moveset.downRelease) {
		downRelease(tank, isLocal, commandObject.xPosition, commandObject.yPosition);
	} else if (command === moveset.enter) {
		enterMove(tank, isLocal);
	} else if (command === moveset.backspace) {
		backspaceMove(tank, isLocal);
	} else if (command === moveset.space) {
		spaceMove(tank, isLocal);
	} else if (command === moveset.button_f) {
		f_buttonMove(tank);
	}
}
