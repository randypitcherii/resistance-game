"use strict";

var thingsToLoad = ["../images/switch_ammo_button.png", "../images/right_arrow.png", "../images/left_arrow.png", "../images/down_arrow.png", "../images/up_arrow.png", "../images/wall.jpg", "../sounds/explosion.mp3", "../images/dynamite.png", "../images/explorer.png", "../fonts/emulogic.ttf", "../images/dungeon.png", "../images/explosion.jpeg", "../images/blob.png", "../images/door.png", "../images/bunny.png", "../sounds/launch_missile.mp3", "../sounds/missile_heat.mp3", "../sounds/normal_bullets.mp3", "../sounds/bullets_hit.mp3", "../images/up.png", "../images/bullet_croped.png", "../images/smoke.png", "../images/debris.png", "../images/monster_boss.png", "../sounds/missile_reloading.wav", "../images/start_button.png", "../images/restart_button.png", "../images/old_map2.jpg", "../images/wall1.jpg", "../images/propeller.png"];

//establish an exit listener to remove this as an active game on exit
window.addEventListener("beforeunload", function (event) {
    $.get("/profile");
});

//global resizing variables
var canvasHeight = 512;
var canvasWidth = 512;
var backgroundWidth = 512;
var backgroundHeight = 512;

//global game instance.
var g;

//wait for page to load, then begin 
$(document).ready(function () {
    //check if is mobile screen for displaying mobile controls
    if ($("#mobileIndicator").is(":visible")) {
	canvasHeight = 620;
    }

    //create and begin game
    g = hexi(canvasWidth, canvasHeight, setup, thingsToLoad, load);

    if ($("#mobileIndicator").is(":visible")) {
        g.scaleToWindow();
    } else {
        //make game responsive to screen size if desktop
        updateCanvasSize();
        $(window).resize(updateCanvasSize);
    }

    g.start();
});

var background = undefined,
    tankA = undefined,
    tankB = undefined,
    turretA = undefined,
    turretB = undefined,
    bullet = undefined,
    bullets = undefined,
    healthBar = undefined,
    message = undefined,
    gameScene = undefined,
    gameOverScene = undefined,
    launch_missileSound = undefined,
    missile_hitSound = undefined,
    normal_bullets_launchSound = undefined,
    normal_bullets_hitSound = undefined,
    missile_reloading_sound = undefined,
    fire_bullet = undefined,
    fire_bullets = undefined,
    healthBar_tankA = undefined,
    tankB_outerBar = undefined,
    tankB_innerBar = undefined,
    healthBar_tankB = undefined,
    tankA_outerBar = undefined,
    tankA_innerBar = undefined,
    gameOverMessage = undefined,
    start_button = undefined,
    healthBar_tankA_prev = undefined,
    healthBar_tankB_prev = undefined,
    walls = undefined,
    wall = undefined,
    a_rect = undefined,
    b_rect = undefined,
    propeller = undefined;

//adds mobile controls
function updateCanvasSize() {
    canvasHeight = 0.8*($(window).height() - 2 * $("#changeControlsButton").height());
    canvasWidth = 0.8*($(window).width() - 2 * $("#changeControlsButton").height());

    var minDimension = Math.min(canvasHeight, canvasWidth);

    $("canvas").height(minDimension).width(minDimension).addClass("center-block");
}

function load() {
    g.loadingBar();
}

function setup() {

    background = g.sprite("../images/old_map2.jpg");
    background.width = backgroundWidth;
    background.height = backgroundHeight;

    console.log("g.canvas.width: " + g.canvas.width + " g.canvas.height is " + g.canvas.height);

    tankA = g.sprite("../images/user_tank_ed1.png");
    tankA.width = background.width / 16;
    tankA.height = background.height / 8;

    tankB = g.sprite("../images/user_tank_ed1.png");
    tankB.width = background.width / 16;
    tankB.height = background.height / 8;

    tankA.anchor.x = 0.5;
    tankA.anchor.y = 0.5;

    tankB.anchor.x = 0.5;
    tankB.anchor.y = 0.5;

    tankB.rotation = Math.PI;

    //set the missle fired to false
    tankA.missle_fired = false;
    tankB.missle_fired = false;

    //set the default wepaon type
    tankA.switch_ammo_flag = 1;
    //for the mirror image test!
    tankB.switch_ammo_flag = 1;

    //set the tank is not current;y reloading
    tankA.missle_reloadFinish_flag = true;
    //for the mirror image test!
    tankB.missle_reloadFinish_flag = true;

    tankA.name = "tankA";
    tankB.name = "tankB";

    tankB.x = 256;
    tankB.y = tankB.height / 2;

    tankA.x = 256;
    tankA.y = 512 - tankA.height / 2;

    /*
       setting the health bar for TANKS
     */

    //creating the health bar for tankB
    tankB_outerBar = g.rectangle(100, 16, "#3a312e"),
    tankB_innerBar = g.rectangle(100, 16, "#f26946");

    healthBar_tankB = g.group(tankB_outerBar, tankB_innerBar);
    healthBar_tankB.inner = tankB_innerBar;
    // this is for tankA
    tankA_outerBar = g.rectangle(100, 16, "#3a312e"),
    tankA_innerBar = g.rectangle(100, 16, "#4eaa4e");

    healthBar_tankA = g.group(tankA_outerBar, tankA_innerBar);
    healthBar_tankA.inner = tankA_innerBar;

    healthBar_tankA.x = background.width - tankA_outerBar.width;
    healthBar_tankA.y = background.height - tankA_outerBar.height;


    healthBar_tankB.x = background.width - tankB_outerBar.width;
    healthBar_tankB.y = 0;


    /*
       initialising the array bullets
     */
    bullets = [];
    fire_bullets = [];
    /*
       Loading the sound
     */
    launch_missileSound = g.sound("../sounds/launch_missile.mp3");
    launch_missileSound.volume = 0.3;
    missile_hitSound = g.sound("../sounds/missile_heat.mp3");
    normal_bullets_launchSound = g.sound("../sounds/normal_bullets.mp3");
    normal_bullets_launchSound.volume = 0.3;
    normal_bullets_hitSound = g.sound("../sounds/bullets_hit.mp3");
    normal_bullets_hitSound.volume = 0.3;

    missile_hitSound.volume = 0.4;
    missile_reloading_sound = g.sound("../sounds/missile_reloading.wav");

    // to create walls
    //createWall();
    
    //initTankControls();    


    g.state = play;
    var forward_button = g.button([
	"../images/up_arrow.png",
    ]);
    
    forward_button.height = 40;
    forward_button.setPosition(120, 520);

    var left_button = g.button([
	"../images/left_arrow.png",
    ]);
    left_button.width = 78;
    left_button.height = 40;
    left_button.setPosition(22, 565);


    var right_button = g.button([
	"../images/right_arrow.png",
    ]);
    right_button.width = 78;
    right_button.height = 40;

    right_button.setPosition(208, 565);

    var down_button = g.button([
	"../images/down_arrow.png",
    ]);
    down_button.width = 78;
    down_button.height = 40;
    //down_button.setPosition(80,g.stage.height - 60);
    down_button.setPosition(120, 565);

    background.interact = true;

    var change_ammo_button = g.button([
	"../images/switch_ammo_button.png",
    ]);
    //change_ammo_button.width = 120;
    change_ammo_button.height = 40;
    //right_button.setPosition(130,g.stage.height - 70);
    change_ammo_button.setPosition(380, 565);

    var mobileInputs = {};
    mobileInputs.forward = forward_button;
    mobileInputs.left = left_button;
    mobileInputs.right = right_button;
    mobileInputs.down = down_button;
    mobileInputs.background = background;
    mobileInputs.changeAmmo = change_ammo_button;

    initTankControls(mobileInputs);

    g.state = play;



}


function detect_walls_tanks_collision() {

    walls = walls.filter(function (wall) {
	//console.log("filter walls");

	var b_rect = {}; 

	if (tankB.rotation  === 3.14 || tankB.rotation === 0 || tankB.rotation === Math.PI) { //up or down
	    b_rect = g.rectangle(tankB.width, tankB.height, "red"); 
	    b_rect.x = tankB.x - tankB.width/2;
	    b_rect.y = tankB.y - tankB.height/2;
	} else {
	    b_rect = g.rectangle(tankB.height, tankB.width, "red"); 
	    b_rect.x = tankB.x - tankB.height/2;
	    b_rect.y = tankB.y - tankB.width/2;
	}
	b_rect.visible = false;

	var a_rect = {}; 

	if (tankA.rotation  === 3.14 || tankA.rotation === 0 || tankA.rotation === Math.PI) { //up or down
	    a_rect = g.rectangle(tankA.width, tankA.height, "red"); 
	    a_rect.x = tankA.x - tankA.width/2;
	    a_rect.y = tankA.y - tankA.height/2;
	} else {
	    a_rect = g.rectangle(tankA.height, tankA.width, "red"); 
	    a_rect.x = tankA.x - tankA.height/2;
	    a_rect.y = tankA.y - tankA.width/2;
	}
	a_rect.visible = false;

	if (g.hitTestRectangle(a_rect, wall)) {
	    //console.log("A hit wall");
	    if (tankA.rotation === 0) { //up
		//console.log("A hit up wall");
		tankA.vx = 0;
		tankA.vy = 0;
		tankA.y = tankA.y + 5; 
	    } else if (tankA.rotation === Math.PI) { // down
		//console.log("A hit down wall");
		tankA.vx = 0;
		tankA.vy = 0;
		tankA.y = tankA.y - 5; 
	    } else if (tankA.rotation === 0.5*Math.PI) { // right
		//console.log("A hit right wall");
		tankA.vx = 0;
		tankA.vy = 0;
		tankA.x = tankA.x - 5; 
	    } else if (tankA.rotation === 270/180*Math.PI) { // left
		//console.log("A hit left wall");
		tankA.vx = 0;
		tankA.vy = 0;
		tankA.x = tankA.x + 5; 
	    } else {
		//console.log("A hit NO wall");
	    }
	}

	if (g.hitTestRectangle(b_rect, wall)) {
	    //console.log("B hit wall");
	    if (tankB.rotation === 0) { //up
		tankB.vx = 0;
		tankB.vy = 0;
		tankB.y = tankB.y + 5; 
	    } else if (tankB.rotation === Math.PI) { // down
		tankB.vx = 0;
		tankB.vy = 0;
		tankB.y = tankB.y - 5; 
	    } else if (tankB.rotation === 0.5*Math.PI) { // right
		tankB.vx = 0;
		tankB.vy = 0;
		tankB.x = tankB.x - 5; 
	    } else if (tankB.rotation === 270/180*Math.PI) { // left
		tankB.vx = 0;
		tankB.vy = 0;
		tankB.x = tankB.x + 5; 
	    }
	}
	g.remove(b_rect);
	g.remove(a_rect);

	return true; // not remove any wall. yet...
    });

}



function play() {

    // to make the propeller in middle rotate
    // propeller.rotation += 0.05;

    //to detect collistion between walls and tanks
    //detect_walls_tanks_collision();
    
    g.move(tankA);
    g.move(tankB);
    //g.move(bullets); 

    //NO IDEA WHY!!!!!!! g.stage screws everything up...
    var stage_container = {};
    stage_container.x = 0;
    stage_container.y = tankA.height / 2;
    stage_container.width = background.width - tankA.height / 2;
    stage_container.height = background.height;

    g.contain(tankA, stage_container);
    g.contain(tankB, stage_container);

    /*
       collision detection for bullets and tanks
     */
    bullets = bullets.filter(function(bullet) {

	//Move the bullet
	g.move(bullet);
	if (bullet.x > backgroundWidth || bullet.x <= 0 || bullet.y > backgroundHeight || bullet.y <= 0) {
	    //console.log("i am out of vbound");
	    g.remove(bullet);
	    return false;
	}


	//Check for a collision with the stage boundary
	//var collision = g.outsideBounds(bullet, g.stage);

	//If there's a collision, display the side that the collision
	//happened on, remove the bullet sprite and filter it out of
	//the `bullets` array

	var b_rect = {};

	if (tankB.rotation === 3.14 || tankB.rotation === 0 || tankB.rotation == Math.PI) { //up or down
	    b_rect = g.rectangle(tankB.width, tankB.height, "red");
	    b_rect.x = tankB.x - tankB.width / 2;
	    b_rect.y = tankB.y - tankB.height / 2;
	} else {
	    b_rect = g.rectangle(tankB.height, tankB.width, "red");
	    b_rect.x = tankB.x - tankB.height / 2;
	    b_rect.y = tankB.y - tankB.width / 2;
	}
	b_rect.visible = false;

	var a_rect = {};

	if (tankA.rotation === 3.14 || tankA.rotation === 0 || tankA.rotation == Math.PI) { //up or down
	    a_rect = g.rectangle(tankA.width, tankA.height, "red");
	    a_rect.x = tankA.x - tankA.width / 2;
	    a_rect.y = tankA.y - tankA.height / 2;
	} else {
	    a_rect = g.rectangle(tankA.height, tankA.width, "red");
	    a_rect.x = tankA.x - tankA.height / 2;
	    a_rect.y = tankA.y - tankA.width / 2;
	}
	a_rect.visible = false;

	if (g.hitTestRectangle(b_rect, bullet)) {
	    g.remove(bullet);
	    g.remove(b_rect);
	    g.remove(a_rect);
	    console.log("hitted with red dot");
	    var damage = -5;

	    if (healthBar_tankB.inner.width + damage <= 0) {
		healthBar_tankB.inner.width = 0;
	    } else {
		healthBar_tankB.inner.width += damage;
	    }
	    normal_bullets_hitSound.play();
	    g.createParticles(tankB.x, tankB.y, function() {
		return g.sprite("../images/debris.png");
	    }, g.stage, 50);

	    //Remove the bullet from the `bullets` array
	    return false;
	} else if (g.hitTestRectangle(a_rect, bullet)) {
	    g.remove(bullet);
	    g.remove(a_rect);
	    g.remove(b_rect);
	    console.log("hitted with red dot");
	    var damage = -5;

	    if (healthBar_tankA.inner.width + damage <= 0) {
		healthBar_tankA.inner.width = 0;
	    } else {
		healthBar_tankA.inner.width += damage;
	    }

	    normal_bullets_hitSound.play();
	    g.createParticles(tankA.x, tankA.y, function() {
		return g.sprite("../images/debris.png");
	    }, g.stage, 50);

	    //Remove the bullet from the `bullets` array
	    return false;
	} else {
	    g.remove(a_rect);
	    g.remove(b_rect);	
	}

	//to enabe walls and bullets collision instead of last else statement:
	/*
	else {
	    let to_remove = true;
	    walls.filter(function (wall) {
		if (g.hitTestRectangle(wall, bullet)) {
		    to_remove = false;
		    g.remove(bullet);
		}
		return true;
	    });
	    g.remove(a_rect);
	    g.remove(b_rect);
	    return to_remove;
	}
	*/
	
	//If the bullet hasn't hit the edge of the screen,
	//keep it in the `bullets` array
	return true;
    });


    /*
       collision detection for fire_bullets and tanks
     */
    fire_bullets = fire_bullets.filter(function(fire_bullet) {

	//Move the bullet
	g.move(fire_bullet);

	//Check for a collision with the stage boundary
	//var collision = g.outsideBounds(fire_bullet, g.stage);
	if (fire_bullet.x > backgroundWidth || fire_bullet.x <= 0 || fire_bullet.y > backgroundHeight || fire_bullet.y <= 0) {
	    console.log("i am out of vbound x: " + fire_bullet.x + " y: " + fire_bullet.y);
	    g.remove(fire_bullet);
	    return false;
	}

	var b_rect = {};

	if (tankB.rotation === 3.14 || tankB.rotation === 0 || tankB.rotation == Math.PI) { //up or down
	    b_rect = g.rectangle(tankB.width, tankB.height, "red");
	    b_rect.x = tankB.x - tankB.width / 2;
	    b_rect.y = tankB.y - tankB.height / 2;
	} else {
	    b_rect = g.rectangle(tankB.height, tankB.width, "red");
	    b_rect.x = tankB.x - tankB.height / 2;
	    b_rect.y = tankB.y - tankB.width / 2;
	}
	b_rect.visible = false;

	var a_rect = {};

	if (tankA.rotation === 3.14 || tankA.rotation === 0 || tankA.rotation == Math.PI) { //up or down
	    a_rect = g.rectangle(tankA.width, tankA.height, "red");
	    a_rect.x = tankA.x - tankA.width / 2;
	    a_rect.y = tankA.y - tankA.height / 2;
	} else {
	    a_rect = g.rectangle(tankA.height, tankA.width, "red");
	    a_rect.x = tankA.x - tankA.height / 2;
	    a_rect.y = tankA.y - tankA.width / 2;
	}
	a_rect.visible = false;


	//If there's a collision, display the side that the collision
	//happened on, remove the bullet sprite and filter it out of
	//the `bullets` array
	if (g.hitTestRectangle(b_rect, fire_bullet)) {
	    g.remove(fire_bullet);
	    g.remove(a_rect);
	    g.remove(b_rect);
	    console.log("hitted with fire_bullet");
	    var damage = -25;

	    if (healthBar_tankB.inner.width + damage <= 0) {
		healthBar_tankB.inner.width = 0;
	    } else {
		healthBar_tankB.inner.width += damage;
	    }
	    missile_hitSound.play();
	    console.log("health left is " + healthBar_tankB.inner.width);
	    g.createParticles(tankB.x, tankB.y,
			      function() {
				  return g.sprite("../images/explosion.jpeg");
			      }, g.stage, 50); // when hitted by rocket output some debris

	    //Remove the bullet from the `bullets` array
	    return false;
	} else if (g.hitTestRectangle(a_rect, fire_bullet)) {
	    g.remove(fire_bullet);
	    g.remove(a_rect);
	    g.remove(b_rect);
	    console.log("hitted with fire_bullet");
	    var damage = -25;

	    if (healthBar_tankA.inner.width + damage <= 0) {
		healthBar_tankA.inner.width = 0;
	    } else {
		healthBar_tankA.inner.width += damage;
	    }
	    missile_hitSound.play();
	    console.log("health left is " + healthBar_tankB.inner.width);
	    g.createParticles(tankA.x, tankA.y,
			      function() {
				  return g.sprite("../images/explosion.jpeg");
			      }, g.stage, 50); // when hitted by rocket output some debris

	    //Remove the bullet from the `bullets` array
	    return false;
	} else {
	    g.remove(a_rect);
	    g.remove(b_rect);
	}

	//to enable walls and bullets collision instead of last else statement:
	/*
	else {
	    let to_remove = true;
	    walls.filter(function (wall) {
		if (g.hitTestRectangle(wall, fire_bullet)) {
		    to_remove = false;
		    g.remove(fire_bullet);
		}
		return true;
	    });
	    
	    g.remove(a_rect);
	    g.remove(b_rect);
	    return to_remove;
	}
	*/

	//If the bullet hasn't hit the edge of the screen,
	//keep it in the `bullets` array
	return true;
    });


    if (healthBar_tankB.inner.width <= 0 && healthBar_tankA.inner.width <= 0) {
	healthBar_tankA.inner.width = 0;
	healthBar_tankB.inner.width = 0;
	gameoverObject.sourceMessage = "IT'S A DRAW!!!";
	gameoverObject.externalMessage = "IT'S A DRAW!!!";
	socket.emit("gameover", gameoverObject);
    } else if (healthBar_tankB.inner.width <= 0) {
	healthBar_tankB.inner.width = 0;
	gameoverObject.sourceMessage = "YOU WON!!!";
	gameoverObject.externalMessage = "YOU LOST!!!";
	socket.emit("gameover", gameoverObject);
    } else if (healthBar_tankA.inner.width <= 0) {
	healthBar_tankA.inner.width = 0;
	gameoverObject.sourceMessage = "YOU LOST!!!";
	gameoverObject.externalMessage = "YOU WON!!!";
	socket.emit("gameover", gameoverObject);
    }

    healthBar_tankA_prev = healthBar_tankA.inner.width
    healthBar_tankB_prev = healthBar_tankB.inner.width;

}

/*
   Function for ending the game 
 */
function end(message) {

    g.pause();

    $("#modalText").text(message);

    $('.modal').modal({
	keyboard: false,
	backdrop : "static"
    });
}


function reset() {

    g.remove(gameOverMessage);

    healthBar_tankA.inner.width = 100;
    healthBar_tankB.inner.width = 100;
    
    /*
       Reinitialise the tank's position
     */
    tankB.x = 256;
    tankB.y = tankB.height / 2;

    tankA.x = 256;
    tankA.y = 512 - tankA.height / 2;

    tankA.rotation = 0;
    tankB.rotation = Math.PI;


    //g.remove(walls);

    g.remove(bullets);
    g.remove(fire_bullets);

    //createWall();

    g.state = play;
    g.resume();
}



/*
   Mirror enemy
 */
function updateEnemy(command) {
    if (command == "left_press") {
	tankB.rotation = -270 / 180 * Math.PI;
	tankB.vx = 5;
	tankB.vy = 0;

    } else if (command == "left_release") {
	tankB.vx = 0;

    } else if (command == "right_press") {
	tankB.rotation = -0.5 * Math.PI;
	tankB.vx = -5;
	tankB.vy = 0;
    } else if (command == "right_release") {
	tankB.vx = 0;
    } else if (command == "up_press") {
	tankB.rotation = 3.14;
	tankB.vy = 5;
	tankB.vx = 0;
    } else if (command == "up_release") {
	tankB.vy = 0;
    } else if (command == "down_press") {
	tankB.rotation = 0;
	tankB.vy = -5;
	tankB.vx = 0;
    } else if (command == "down_release") {
	tankB.vy = 0;
    } else if (command == "space_press") {
	fire(tankB);
    } else if (command == -1) {
	tankB.switch_ammo_flag = -1;
    } else if (command == 1) {
	tankB.switch_ammo_flag = 1;
    }

}


function fire(tank) {
    console.log("FIRE!!!");
    tank.missle_fired = true;
    if (tank.switch_ammo_flag == 1 && tank.missle_reloadFinish_flag == true) {
	console.log(tank.name + " fire with rocket");

	//dont know why * 6, just trial and error...
	g.shoot(tank, tank.rotation - Math.PI / 2, 0, -7.5 * tank.height, g.stage, 7, fire_bullets,
		function() {
		    
		    /*
		       fire_bullet = g.sprite("../images/bullet_croped.png");
		       fire_bullet.width = tank.width/2 ;
		       fire_bullet.height = tank.height/2 ;
		       fire_bullet.rotation = tank.rotation;
		     */

		    fire_bullet = g.circle(15, "#ad0606");
		    return fire_bullet;
		});
	tank.missle_reloadFinish_flag = false;

	//trying to implement the wait time
	g.wait(5000, function() {
	    tank.missle_reloadFinish_flag = true;
	});

	launch_missileSound.play(); // this will play the missile sound!
	g.wait(1000, function() {
	    missile_reloading_sound.play();
	});

    } else if (tank.switch_ammo_flag == -1) { //tankA.halfWidth
	console.log(tank.name + "fire with red dot");

	//dont know why * 6, just trial and error...
	g.shoot(tank, tank.rotation - Math.PI / 2, 0, -5 * tank.height, g.stage, 3, bullets,
		function() {

		    return g.circle(10, "#c43714");
		});

	normal_bullets_launchSound.play();
    }
}

function createWall() {
    walls = [];

    // NUBMER 1 wall
    for (var i = 0; i < 4; i++) {

	wall = g.rectangle(tankA.width, tankA.width, "#644242");
	wall.anchor.x = 0.5;
	wall.anchor.y = 0.5;
	let x = 1 / 4 * backgroundWidth;

	console.log("first_wall x" + i + " is " + x);

	let y = (1 / 4 * backgroundHeight) + tankA.width * i;

	console.log("first_wall y" + i + " is " + y);

	wall.x = x;
	wall.y = y
	walls.push(wall);

	let tree_core = g.sprite("../images/wall1.jpg");

	tree_core.width = tankA.width;
	tree_core.height = tankA.width;

	tree_core.anchor.x = 0.5;
	tree_core.anchor.y = 0.5;

	tree_core.x = x;
	tree_core.y = y;
    }

    // symmetric one
    for (var i = 0; i < 4; i++) {

	wall = g.rectangle(tankA.width, tankA.width, "#644242");

	wall.anchor.x = 0.5;
	wall.anchor.y = 0.5;
	let x = backgroundWidth - 1 / 4 * backgroundWidth;

	console.log("mirror_wall x" + i + " is " + x);

	let y = (backgroundHeight - 1 / 4 * backgroundHeight) - tankA.width * i;

	console.log("mirror_wall y" + i + " is " + y);

	wall.x = x;
	wall.y = y
	walls.push(wall);

	let tree_core = g.sprite("../images/wall1.jpg");

	tree_core.width = tankA.width;
	tree_core.height = tankA.width;

	tree_core.anchor.x = 0.5;
	tree_core.anchor.y = 0.5;

	tree_core.x = x;
	tree_core.y = y;
    }

    // to make the spinning propeller in the middle
    wall = g.rectangle(1.5 * tankA.width, 1.5 * tankA.width, "#644242");

    wall.anchor.x = 0.5;
    wall.anchor.y = 0.5;
    let x = backgroundWidth/2;

    let y = backgroundHeight/2;

    wall.x = x;
    wall.y = y
    wall.visible = false;
    walls.push(wall);

    propeller = g.sprite("../images/propeller.png");

    propeller.width = 1.5 * tankA.width;
    propeller.height = 1.5 * tankA.width;

    propeller.anchor.x = 0.5;
    propeller.anchor.y = 0.5;

    propeller.x = x;
    propeller.y = y;

}
