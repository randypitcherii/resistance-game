"use strict";

var thingsToLoad = ["../images/wall.jpg","../sounds/explosion.mp3","../images/dynamite.png","../images/explorer.png","../fonts/emulogic.ttf","../images/dungeon.png","../images/explosion.jpeg","../images/blob.png","../images/door.png","../images/bunny.png","../sounds/launch_missile.mp3","../sounds/missile_heat.mp3","../sounds/normal_bullets.mp3","../sounds/bullets_hit.mp3","../images/up.png","../images/bullet_croped.png","../images/smoke.png","../images/debris.png","../images/monster_boss.png","../sounds/missile_reloading.wav","../images/start_button.png","../images/restart_button.png","../images/old_map2.jpg","../images/wall1.jpg" ];


// Change that to nopt to be hardcoded!!!
var canvasHeight = 512;
var canvasWidth = 512;
var g = hexi(canvasWidth,canvasHeight,start,thingsToLoad,load);

g.scaleToWindow();
g.start();


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
    tankA_outerBar = undefined,
    tankA_innerBar = undefined,
    healthBar_tankA = undefined,
    tankB_outerBar = undefined,
    tankB_innerBar = undefined,
    healthBar_tankB = undefined,
    tankB_outerBar = undefined,
    tankB_innerBar = undefined,
    tankA_outerBar = undefined,
    tankA_innerBar = undefined,
    gameOverMessage = undefined,
    start_button = undefined,
    healthBar_tankA_prev = undefined,
    healthBar_tankB_prev = undefined,
    walls = undefined,
    wall = undefined,
    a_rect = undefined,
    b_rect = undefined;


function load() {
    g.loadingBar();
}

// start here
function start() {
    //load the start button
    start_button = g.button(["../images/start_button.png"]);
    start_button.visible = true;
    console.log(start_button.width);
    g.stage.putCenter(start_button,g.stage.width/2 - start_button.width/2, g.stage.height/2);

    /*
       When the user clicks it goes to the setup place!
     */
    start_button.release = () => {
	start_button.visible = false; // set it to be not visible!
	start_button.interact = false; // dont want it to be interacted even though it is invisible
	setup();
    };

}



function setup() {

    background = g.sprite("../images/old_map2.jpg");
    background.width = canvasWidth;
    background.height = canvasHeight;

    
    console.log("g.canvas.width: " + g.canvas.width + " g.canvas.height is " + g.canvas.height);
    
    tankA = g.sprite("../images/user_tank_ed1.png");
    tankA.width = g.canvas.width / 16;
    tankA.height = g.canvas.height / 8;

    tankB = g.sprite("../images/user_tank_ed1.png");
    tankB.width = g.canvas.width / 16;
    tankB.height = g.canvas.height / 8;
        
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
    tankB.y = tankB.height/2;

    tankA.x = 256;
    tankA.y = 512 - tankA.height/2;

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

    healthBar_tankA.x = g.canvas.width - tankA_outerBar.width;
    healthBar_tankA.y = g.canvas.height - tankA_outerBar.height;

    healthBar_tankB.x = g.canvas.width - tankB_outerBar.width;
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

    createWall();
    initTankControls();    

    
    g.state = play;



}

function play() {
    //console.log("the rotation in playing mode " + turretA.rotation);

    /*
    let tankA_wall_collision = g.hit(tankA, walls, true, false, false,
				     function(collision, platform) {
					 if (collision == "right") {
					     //tankA.vx = 0;
					 } else if (collision == "left") {
					     //tankA.vy = 0;
					 }
					 console.log("collsiion side is " + collision);
				     }
    );
    let tankB_wall_collision = g.hit(tankB, walls, true, false, false,
				     function(collision, platform) {
					 if (collision == "right") {
					     //tankB.vx = 0;
					 } else if (collision == "left") {
					     //tankB.vy = 0;
					 }
					 console.log("collsiion side is " + collision);
				     }
    );
    */

    

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
    



    g.move(tankA);
    g.move(tankB);
    //g.move(bullets); 

    //NO IDEA WHY!!!!!!! g.stage screws everything up...
    var stage_container = {};
    stage_container.x = 0;
    stage_container.y = tankA.height/2;
    stage_container.width  = g.canvas.width - tankA.height/2;
    stage_container.height = g.canvas.height;
    
    g.contain(tankA, stage_container);
    g.contain(tankB, stage_container);

    /*
       collision detection for bullets and tanks
     */
    bullets = bullets.filter(function (bullet) {

	//Move the bullet
	g.move(bullet);
	if(bullet.x > canvasWidth || bullet.x <= 0 || bullet.y > canvasHeight || bullet.y <= 0) {
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
	
	if (g.hitTestRectangle(b_rect,bullet)) {
	    g.remove(bullet);
	    g.remove(b_rect);
	    g.remove(a_rect);
	    console.log("hitted with red dot");
	    var damage = -5;
	    
	    if(healthBar_tankB.inner.width + damage <= 0) {
		healthBar_tankB.inner.width = 0;
	    } else {
		healthBar_tankB.inner.width += damage;
	    }
	    normal_bullets_hitSound.play();
	    g.createParticles(tankB.x, tankB.y, function () {
		return g.sprite("../images/debris.png");
	    }, g.stage, 50);
	    
	    //Remove the bullet from the `bullets` array
	    return false;
	} else if (g.hitTestRectangle(a_rect,bullet)) {
	    g.remove(bullet);
	    g.remove(a_rect);
	    g.remove(b_rect);
	    console.log("hitted with red dot");
	    var damage = -5;

	    if(healthBar_tankA.inner.width + damage <= 0) {
		healthBar_tankA.inner.width = 0;
	    } else {
		healthBar_tankA.inner.width += damage;
	    }

	    normal_bullets_hitSound.play();
	    g.createParticles(tankA.x, tankA.y, function () {
		return g.sprite("../images/debris.png");
	    }, g.stage, 50);

	    //Remove the bullet from the `bullets` array
	    return false;
	} else {
	    g.remove(a_rect);
	    g.remove(b_rect);
	}

	//If the bullet hasn't hit the edge of the screen,
	//keep it in the `bullets` array
	return true;
    });


    /*
       collision detection for fire_bullets and tanks
     */
    fire_bullets = fire_bullets.filter(function (fire_bullet) {

	//Move the bullet
	g.move(fire_bullet);

	//Check for a collision with the stage boundary
	//var collision = g.outsideBounds(fire_bullet, g.stage);
	if(fire_bullet.x > canvasWidth || fire_bullet.x <= 0 || fire_bullet.y > canvasHeight || fire_bullet.y <= 0) {
	    console.log("i am out of vbound x: " + fire_bullet.x + " y: "+ fire_bullet.y);
	    g.remove(fire_bullet);
	    return false;
	}

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

	
	//If there's a collision, display the side that the collision
	//happened on, remove the bullet sprite and filter it out of
	//the `bullets` array
	if (g.hitTestRectangle(b_rect, fire_bullet)) {
	    g.remove(fire_bullet);
	    g.remove(a_rect);
	    g.remove(b_rect);
	    console.log("hitted with fire_bullet");
	    var damage = -25;

	    if(healthBar_tankB.inner.width + damage <= 0) {
		healthBar_tankB.inner.width = 0;
	    } else {
		healthBar_tankB.inner.width += damage;
	    }
	    missile_hitSound.play();
	    console.log("health left is " + healthBar_tankB.inner.width);
	    g.createParticles(tankB.x, tankB.y,
			      function () {
				  return g.sprite("../images/explosion.jpeg");
			      }
			    , g.stage, 50); // when hitted by rocket output some debris

	    //Remove the bullet from the `bullets` array
	    return false;
	} else if (g.hitTestRectangle(a_rect,fire_bullet)) {
	    g.remove(fire_bullet);
	    g.remove(a_rect);
	    g.remove(b_rect);
	    console.log("hitted with fire_bullet");
	    var damage = -25;

	    if(healthBar_tankA.inner.width + damage <= 0) {
		healthBar_tankA.inner.width = 0;
	    } else {
		healthBar_tankA.inner.width += damage;
	    }
	    missile_hitSound.play();
	    console.log("health left is " + healthBar_tankB.inner.width);
	    g.createParticles(tankA.x, tankA.y,
			      function () {
				  return g.sprite("../images/explosion.jpeg");
			      }
			    , g.stage, 50); // when hitted by rocket output some debris

	    //Remove the bullet from the `bullets` array
	    return false;
	} else {
	    g.remove(a_rect);
	    g.remove(b_rect);
	}

	//If the bullet hasn't hit the edge of the screen,
	//keep it in the `bullets` array
	return true;
    });
    
    
    if(healthBar_tankB.inner.width <= 0 && healthBar_tankA.inner.width <= 0) {
	healthBar_tankA.inner.width = 0;
	healthBar_tankB.inner.width = 0;
	g.state = end("IT'S A DRAW!!!");
    } else if (healthBar_tankB.inner.width <= 0) {
	healthBar_tankB.inner.width = 0;
	g.state = end("YOU WON!!!");
    } else if (healthBar_tankA.inner.width <= 0) {
	healthBar_tankA.inner.width = 0;
	g.state = end("YOU LOST!!!");
    }
    
    healthBar_tankA_prev = healthBar_tankA.inner.width
    healthBar_tankB_prev = healthBar_tankB.inner.width;

}

/*
   Function for ending the game 
 */
function end(message) {
    
    g.pause();
    
    gameOverMessage = g.text("", "48px Futura","#ed3434",canvasWidth/2 - 120, canvasHeight/2 + 20);
    
    gameOverMessage.content = message;
    var restart_button = g.button(["../images/restart_button.png"]);
    g.stage.putCenter(restart_button,0,0);

    restart_button.release = () => {
	restart_button.visible = false;
	restart_button.interact = false;
	reset();
    };
}


function reset() {

    g.remove(gameOverMessage);
    
    healthBar_tankA.inner.width = 100;
    healthBar_tankB.inner.width = 100;
    g.stage.putBottom(tankA);
    g.stage.putTop(tankB);

    tankA.rotation = 0;
    tankB.rotation = Math.PI;
    g.remove(walls);

    g.remove(bullets);
    g.remove(fire_bullets);

    createWall();

    g.state = play;
    g.resume();
}



/*
   Mirror enemy
 */
function updateEnemy(command) {
    if(command === "left_press") {
	tankB.rotation = -270 / 180 * Math.PI;
	tankB.vx = 5;
	tankB.vy = 0;

    } else if (command === "left_release") {
	tankB.vx = 0;

    } else if (command === "right_press") {
	tankB.rotation = -0.5 * Math.PI;
	tankB.vx = -5;
	tankB.vy = 0;
    } else if (command === "right_release") {
	tankB.vx = 0;
    } else if (command === "up_press") {
	tankB.rotation = 3.14;
	tankB.vy = 5;
	tankB.vx = 0;
    } else if (command === "up_release") {
	tankB.vy = 0;
    } else if (command === "down_press") {
	tankB.rotation = 0;
	tankB.vy = -5;
	tankB.vx = 0;
    } else if (command === "down_release") {
	tankB.vy = 0;
    } else if (command === "space_press") {
	fire(tankB);
    } else if (command === -1) {
	tankB.switch_ammo_flag = -1;
    } else if (command === 1) {
	tankB.switch_ammo_flag = 1;
    }

}


function fire(tank) {
    console.log("FIRE!!!");
    tank.missle_fired = true;
    if(tank.switch_ammo_flag === 1 && tank.missle_reloadFinish_flag === true) {
	console.log(tank.name + " fire with rocket");

	//dont know why * 6, just trial and error...
	g.shoot(tank,tank.rotation - Math.PI/2,0,-7.5*tank.height,g.stage,7,fire_bullets,
		function() {
		    /*
		    fire_bullet = g.sprite("../images/bullet_croped.png");
		    fire_bullet.width = tank.width/2 ;
		    fire_bullet.height = tank.height/2 ;
		    fire_bullet.rotation = tank.rotation;
		    */

		    fire_bullet = g.circle(15,"#ad0606");
		    return fire_bullet;
		});
	tank.missle_reloadFinish_flag = false;

	//trying to implement the wait time
	g.wait(5000, function () {
	    tank.missle_reloadFinish_flag = true;
	});

	launch_missileSound.play(); // this will play the missile sound!
	g.wait(1000, function () {
	    missile_reloading_sound.play();
	});

    } else if(tank.switch_ammo_flag === -1) {    //tankA.halfWidth
	console.log(tank.name + "fire with red dot");

	//dont know why * 6, just trial and error...
	g.shoot(tank,tank.rotation - Math.PI/2,0,-5*tank.height,g.stage,3,bullets,
		function() {

		    return g.circle(10,"#c43714");
		});

	normal_bullets_launchSound.play();
    }
}
function createWall() {
    walls = [];
    
    // NUBMER 1 wall
    for (var i = 0; i < 4; i++) {

	wall =  g.rectangle(tankA.width,tankA.width, "#644242");
	wall.anchor.x = 0.5;
	wall.anchor.y = 0.5;
	let x = 1/4*canvasWidth;

	console.log("first_wall x" + i + " is " + x);
	
	let y = (1/4*canvasHeight) + tankA.width * i;

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
	
	wall =  g.rectangle(tankA.width,tankA.width, "#644242");
	
	wall.anchor.x = 0.5;
	wall.anchor.y = 0.5;
	let x = canvasWidth - 1/4*canvasWidth;
	// avoding collision
	console.log("mirror_wall x" + i + " is " + x);
	
	let y = (canvasHeight - 1/4*canvasHeight) - tankA.width* i;

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

    console.log("tankA.x: " + tankA.x + " tankA.y: " + tankA.y + " tankB.x: " + tankB.x + " tankB.y: " + tankB.y);
    
}

