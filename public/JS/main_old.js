"use strict";

var thingsToLoad = ["../images/wall.jpg", "../sounds/explosion.mp3", "../images/dynamite.png", "../images/explorer.png", "../fonts/emulogic.ttf", "../images/dungeon.png", "../images/explosion.jpeg", "../images/blob.png", "../images/door.png", "../images/bunny.png", "../sounds/launch_missile.mp3", "../sounds/missile_heat.mp3", "../sounds/normal_bullets.mp3", "../sounds/bullets_hit.mp3", "../images/up.png", "../images/bullet.png", "../images/smoke.png", "../images/debris.png", "../images/monster_boss.png", "../sounds/missile_reloading.wav", "../images/start_button.png", "../images/restart_button.png"];

var g = hexi(512, 512, start, thingsToLoad, load);

g.scaleToWindow();
g.start();


var tankA = undefined,
    tankB = undefined,
    scoreDisplay = undefined,
    music = undefined,
    bullets = undefined,
    winner = undefined,
    shootSound = undefined,
    explosionSound = undefined,
    aliens = undefined,
    score = undefined,
    scoreNeededToWin = undefined,
    alienFrequency = undefined,
    alienTimer = undefined,
    gameOverMessage = undefined,
    fire_bullet = undefined,
    bunny = undefined,
    launch_missileSound = undefined,
    missile_hitSound = undefined,
    normal_bullets_launchSound = undefined,
    normal_bullets_hitSound = undefined,
    background = undefined,
    tankA_outerBar = undefined,
    tankA_innerBar = undefined,
    healthBar_tankA = undefined,
    fire_bullet = undefined,
    monster_boss = undefined,
    start_button = undefined,
    dynamites = undefined,
    tankB_outerBar = undefined,
    tankB_innerBar = undefined,
    healthBar_tankB = undefined,
    dynamite_counter,
    dynamite_max,
    missile_reloading_timer = undefined,
    //missle_reloadFinish_flag = true,
    missile_reloading_sound = undefined,
    pointer = undefined,
    //switch_ammo_flag = 1,
    dust = undefined,
    wall = undefined,
    walls = undefined;

// this loads stuff before the games start making sure everything is loading properly before starting
function load() {
	g.loadingBar();
}

// start here
function start() {
	//load the start button
	start_button = g.button(["../images/start_button.png"]);
	start_button.visible = true;
	console.log(start_button.width);
	g.stage.putCenter(start_button, g.stage.width / 2 - start_button.width / 2, g.stage.height / 2);

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
	background = g.sprite("../images/dungeon.png");

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


	g.stage.putBottom(tankA, 0, -tankA.height);
	g.stage.putTop(tankB, 0, tankB.height + 5);

	//creating the health bar for tankB
	tankB_outerBar = g.rectangle(128, 16, "black"),
		       tankB_innerBar = g.rectangle(128, 16, "red");

	healthBar_tankB = g.group(tankB_outerBar, tankB_innerBar);
	healthBar_tankB.inner = tankB_innerBar;

	healthBar_tankB.x = g.canvas.width - healthBar_tankB.width;
	healthBar_tankB.y = 0;

	// this is for tankA
	tankA_outerBar = g.rectangle(128, 16, "black"),
		       tankA_innerBar = g.rectangle(128, 16, "green");

	healthBar_tankA = g.group(tankA_outerBar, tankA_innerBar);
	healthBar_tankA.inner = tankA_innerBar;

	healthBar_tankA.x = g.canvas.width - tankA_outerBar.width;
	healthBar_tankA.y = g.canvas.height - tankA_outerBar.height;

	createWall();

	// end of creating health bar



	//monster_boss = []; // ths monster boss!

	//setting up the bullets array (a lot of it ! ) variable
	bullets = [];

	//a lot of aliens variable!
	aliens = [];

	/*
	   Loading all the sound
	   */

	//sound when missile is launcehd NOTE: this is only just creating it not playing!
	launch_missileSound = g.sound("../sounds/launch_missile.mp3");
	launch_missileSound.volume = 0.1;
	missile_hitSound = g.sound("../sounds/missile_heat.mp3");
	normal_bullets_launchSound = g.sound("../sounds/normal_bullets.mp3");
	normal_bullets_launchSound.volume = 0.1;
	normal_bullets_hitSound = g.sound("../sounds/bullets_hit.mp3");
	missile_reloading_sound = g.sound("../sounds/missile_reloading.wav");

	scoreDisplay = g.text("0", "20px emulogic", "#00FF00", 400, 10);

	missile_reloading_timer = 0;

	// music?

	//create tank controls
	initTankControls();    

	//setting up the dust when the healthbar is below a certain value i want to show the smoke puffing out
	// dust.play();

	/*
	   FOR MOBILE
	   */
	/*
	   var forward_button = g.button([
	   "../images/up.png",
	   ]);
	   forward_button.width = 40;
	   forward_button.height = 40;
	   forward_button.press = () => {
	   console.log("state is " + forward_button.state);
	   tankA.rotation = 0;
	   tankA.vy = -5;
	   tankA.vx = 0;
	   };
	   forward_button.release = () => {
	   if (!down_button.isDown && tankA.vx === 0) {
	   tankA.vy = 0;
	   }
	   };
	   forward_button.setPosition(80,g.stage.height - 120);
	   var left_button = g.button([
	   "../images/up.png",
	   ]);
	   left_button.width = 40;
	   left_button.height = 40;
	   left_button.press = () => {
	   tankA.rotation = 270 / 180 * Math.PI;
	//Change the player's velocity when the key is pressed.
	tankA.vx = -5;
	tankA.vy = 0;
	console.log("state is " + left_button.state);
	};
	left_button.release = function() {
	//If the left arrow has been released, and the right arrow isn't down,
	//and the player isn't moving vertically:
	//Stop the player.
	if (!right_button.isDown && tankA.vy === 0) {
	tankA.vx = 0;
	}
	};
	left_button.setPosition(20,g.stage.height - 60);
	var right_button = g.button([
	"../images/up.png",
	]);
	right_button.width = 40;
	right_button.height = 40;
	right_button.press = () => {
	tankA.rotation = 0.5 * Math.PI;
	tankA.vx = 5;
	tankA.vy = 0;
	console.log("state is " + right_button.state);
	};
	right_button.release = function () {
	if (!right_button.isDown && tankA.vy === 0) {
	tankA.vx = 0;
	}
	};
	right_button.setPosition(140,g.stage.height - 60);
	var down_button = g.button([
	"../images/up.png",
	]);
	down_button.width = 40;
	down_button.height = 40;
	down_button.press = () => {
	tankA.rotation = Math.PI;
	tankA.vy = 5;
	tankA.vx = 0;
};
down_button.release = () => {
	if (!forward_button.isDown && tankA.vx === 0) {
		tankA.vy = 0;
	}
};
down_button.setPosition(80,g.stage.height - 60);
background.interact = true;
background.press = () => {
	if(switch_ammo_flag == 1 && missle_reloadFinish_flag == true) {
		g.shoot(tankA,tankA.rotation - Math.PI/2,0,0,g.stage,7,bullets,
				function() {
					fire_bullet = g.sprite("../images/bullet.png");
					fire_bullet.width = tankA.width ;
					fire_bullet.height = tankA.height ;
					fire_bullet.rotation = tankA.rotation;
					return fire_bullet;
					//return g.circle(8,"red");
				});
		missle_reloadFinish_flag = false;
		//trying to implement the wait time
		g.wait(3000, function () {
			missle_reloadFinish_flag = true;
		});
		launch_missileSound.play();  
	} else if(switch_ammo_flag == -1) {
		g.shoot(tankA,tankA.rotation - Math.PI/2,tankA.width * 5/6,0,g.stage,3,bullets,
				function() {
					//bunny = g.sprite("../images/bunny.png");
					//bunny.width = tankA.width ;
					//bunny.height = tankA.height ;
					//bunny.rotation = tankA.rotation;
					return g.circle(8,"red");
					//return bunny;
				});
		normal_bullets_launchSound.play();
	}
};
*/

/*
   END OF FOR MOBILE VERSION
   */

g.state = play;

score = 0;
scoreNeededToWin = 60;
alienTimer = 0;
alienFrequency = 100;
winner = "";
}


function fire(tank) {
	console.log("FIRE!!!");

	console.log("background.width is " + background.width);
	console.log("background.height is " + background.height);
	tank.missle_fired = true;
	if (tank.switch_ammo_flag == 1 && tank.missle_reloadFinish_flag == true) {
		console.log(tank.name + " fire with rocket");

		//dont know why * 6, just trial and error...
		g.shoot(tank, tank.rotation - Math.PI / 2, 0, -tank.height * 6, g.stage, 7, bullets,
				function() {
					fire_bullet = g.sprite("../images/bullet.png");
					fire_bullet.width = tank.width;
					fire_bullet.height = tank.height;
					fire_bullet.rotation = tank.rotation;

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
		g.shoot(tank, tank.rotation - Math.PI / 2, 0, -tank.height * 6, g.stage, 3, bullets,
				function() {

					bunny = g.sprite("../images/bunny.png");
					//bunny.width = tankA.width ;
					//bunny.height = tankA.height ;
					bunny.rotation = tank.rotation;

					return bunny;
				});

		normal_bullets_launchSound.play();
	}
}


function startDust(tank) {
	dust = g.particleEmitter(200, () => {
		g.createParticles(
			//The function
			tank.x + 8, //x position
			tank.y - tank.halfHeight + 8, //y position
			() => g.sprite("../images/smoke.png"), //Particle sprite
			g.stage, //The container to add the particles to               
			20, //Number of particles
			0, //Gravity
			false, //Random spacing
			0, 6.28, //Min/max angle
			12, 18, //Min/max size
			1, 2, //Min/max speed
			0.005, 0.01, //Min/max scale speed
			0.005, 0.01, //Min/max alpha speed
			0.05, 0.1 //Min/max rotation speed
			);
	});
}

// CANNOT DIE WITH OTHER WEAPON (RED DOTS)
// IF YO FIRE TO THE RIGHT SIDE OF ENEMY TANK IT DOES NOT GET HIT
// ALSO RED DOTS COME NOT FROM THE CENTER OF TANK
// YOU WON IS NOT IN THE CENTER
// HEALTH BAR FOR TANKA DOESNOT WORK WELL WHEN IT SJOULD DIE!

function play() {
	g.contain(tankA, background);
	g.contain(tankB,background);

	let tankA_wall_collision = g.hit(tankA, walls, true, false, false,
			function(collision, platform) {
				if (collision == "right") {
					tankA.vx = 0;
				} else if (collision == "left") {
					tankA.vy = 0;
				}
				console.log("collsiion side is " + collision);
			}
			);
	let tankB_wall_collision = g.hit(tankB, walls, true, false, false,
			function(collision, platform) {
				if (collision == "right") {
					tankB.vx = 0;
				} else if (collision == "left") {
					tankB.vy = 0;
				}
				console.log("collsiion side is " + collision);
			}
			);

	g.move(tankA);
	g.move(tankB);

	g.move(bullets);





	/*
	   FILTERING THE WALL
	   */


	walls = walls.filter(function(wall) {
		var wall_alive = true;
		bullets = bullets.filter(
			function(bullet) {
				if (g.hitTestRectangle(wall, bullet)) {
					g.remove(bullet);
					g.remove(wall);
					wall_alive = false;
					return false;

				} else {
					return true;
				}
			});
		return wall_alive;
	});




	/*
	   Spawn a monster boss!
	   */
	/*
	   var boss =  g.sprite["../images/monster_boss"];
	   boss.health = 300;
	   monster_boss.health = 200;
	   monster.x = g.randomInt(0,14) * background.width;
	   monster_boss.y = 0 - monster_boss.height;
	   */

	/*
	   bullets = bullets.filter(function (bullet) {
	//Check for a collision between an alien and bullet.
	if (g.hitTestRectangle(tankA, bullet)) {
	console.log("hit tankA!");
	//Remove the bullet sprite.
	//      g.remove(bullet);
	//Wait for 1 second (1000 milliseconds) then
	//Remove the bullet from the `bullets array.
	return false;
	} else {
	return true;
	}
	});
*/

	bullets = bullets.filter(
			function(bullet) {
				//there is a hit on one of the type of bullets
				if (bullet.y > background.height - (bullet.height / 3) || bullet.x > background.width) {
					g.remove(bullet);
					bullet.vy = 0;
					return false;
				}
				//checking when the guy loses

				//if bullet hit tankA     
				if (g.hitTestRectangle(tankB, bullet)) {

					console.log("hit tank B");
					g.remove(bullet);

					if (tankA.switch_ammo_flag == 1) { // this is for missile
						console.log("hitted with missle");
						//missile_hitSound.volume = 0.1;
						missile_hitSound.play();
						var damage = -25;
						if (healthBar_tankB.inner.width + damage <= 0) {
							healthBar_tankB.inner.width = 0;
							//g.state = end;
							console.log("healthBar inner width is " + healthBar_tankB.inner.width);
						} else {
							console.log("not end");
							healthBar_tankB.inner.width += damage;
						}

						if (healthBar_tankB.inner.width < 64) {
							console.log("play dust");
							//dust.play();

						}
						// adding smoke when it is below half health

						g.createParticles(tankB.x, tankB.y,
								function() {
									return g.sprite("../images/explosion.jpeg");
								}, g.stage, 50); // when hitted by rocket output some debris

					} else if (tankA.switch_ammo_flag == -1) {
						console.log("hitted with red dot");
						healthBar_tankB.inner.width += -1;
						normal_bullets_hitSound.play();
						g.createParticles(tankB.x, tankB.y, function() {
							return g.sprite("../images/debris.png");
						}, g.stage, 50); // when hitted by rocket output some debris
					} else {
						console.log("not hit T ll");
					}

					return false; //removing bullets from the function

				} else if (g.hitTestRectangle(tankA, bullet)) {
					console.log("hit tank A");
					g.remove(bullet);
					if (tankB.switch_ammo_flag == 1) { // this is for missile
						//missile_hitSound.volume = 0.1;
						missile_hitSound.play();
						var damage = -25;
						if (healthBar_tankA.inner.width + damage <= 0) {
							healthBar_tankA.inner.width = 0;
							//g.state = end;
							console.log("healthBar inner width is " + healthBar_tankA.inner.width);
						} else {
							healthBar_tankA.inner.width += damage;
						}

						if (healthBar_tankA.inner.width < 64) {
							//dust.play();
						}
						// adding smoke when it is below half health

						g.createParticles(tankA.x, tankA.y,
								function() {
									return g.sprite("../images/explosion.jpeg");
								}, g.stage, 50); // when hitted by rocket output some debris

					} else if (tankB.switch_ammo_flag == -1) {
						healthBar_tankA.inner.width += -1;
						normal_bullets_hitSound.play();
						g.createParticles(tankA.x, tankA.y,
								function() {
									return g.sprite("../images/debris.png");
								}, g.stage, 50); // when hitted by rocket output some debris
					}
					return false; //removing bullets from the function
				} else {
					return true;
				}
			});



	if (healthBar_tankB.inner.width <= 0 && healthBar_tankA.inner.width <= 0) {
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






	//updateEnemy(tankA.x, tankA.y, tankA.rotation, tankA.switch_ammo_flag, tankA.missle_fired);
	tankA.missle_fired = false;

}


/*
   Function for ending the game 
   */
function end(message) {

	g.pause();
	//console.log("at end");
	gameOverMessage = g.text("", "48px Futura", "black", background.width / 2, background.height / 2 + 20);
	//gameOverMessage = background.text("", "48px Futura","black",background.width/2,bac);
	gameOverMessage.content = message;
	var restart_button = g.button(["../images/restart_button.png"]);
	background.putCenter(restart_button, 0, 0);
	restart_button.release = () => {
		restart_button.visible = false;
		restart_button.interact = false;
		reset();
	};
	//g.wait(3000, () => reset());
}
/*
   To restart the damn game
   */

function reset() {

	g.remove(gameOverMessage);
	//healthBar_tankA.inner.width = tankA_innerBar.width;
	//healthBar_tankB.inner.width = tankB_innerBar.width;

	healthBar_tankA.inner.width = 128;
	healthBar_tankB.inner.width = 128;


	g.stage.putBottom(tankA, 0, -tankA.height);
	g.stage.putTop(tankB, 0, tankB.height + 5);
	g.remove(bullets);
	g.remove(aliens);
	//dust.stop();


	g.state = play;
	g.resume();
}







/*
   alienTimer++;
// this is to slowly spawn aliens
if(alienTimer === alienFrequency) {
var alienFrames = ["../images/blob.png"]; // can add more frames so that what should it appear when it dies 
var alien = g.sprite(alienFrames);
alien.health = 50; // initialising health of 50
// this is where u add the states such as alive or something
alien.states = {
alive: 0
};
alien.y = 0 - alien.height; // set it super above
alien.x = g.randomInt(0,14) * alien.width;
//set its speed
alien.vy = 1;
//push the alien to aliens array!
aliens.push(alien);
alienTimer = 0;
if(alienFrequency > 2 ) {
alienTimer--;
}
}
g.move(aliens);
//checkign for collision between aliens and bullets
aliens = aliens.filter(function (alien) {
//A variable to help check if the alien is
//alive or dead.
var alienIsAlive = true;
//Filter though all the bullets.
bullets = bullets.filter(
function (bullet) {
//Check for a collision between an alien and bullet.
if (g.hitTestRectangle(alien, bullet)) {
//Remove the bullet sprite.
g.remove(bullet);
//Show the alien's `destroyed` state.
//alien.show(alien.states.destroyed);
//You could alternatively use the frame number,
//like this:
//alien.show(1);
var damage = -25;
alien.health += damage;
console.log("alien health is " + alien.health);
if(alien.health <= 0) {
console.log("here");
//Stop the alien from moving.
alien.vy = 0;
//Set `alienAlive` to false so that it can be
//removed from the array.
alienIsAlive = false;
//Wait for 1 second (1000 milliseconds) then
//remove the alien sprite.
}
//Update the score.
//score += 1;
//Remove the bullet from the `bullets array.
return false;
} else {
	//If there's no collision, keep the bullet in the
	//bullets array.
	return true;
}
});
//Return the value of `alienIsAlive` back to the
//filter loop. If it's `true`, the alien will be
//kept in the `aliens` array.
//If it's `false` it will be removed from the `aliens` array.
return alienIsAlive;
});
//checking when aliens reaches the background
aliens = aliens.filter(function (alien) {
	var alien_alive = true;
	if(alien.y > background.height - alien.height) {
		alien_alive = false;
		//g.wait(1000, () => g.remove(alien));
		g.remove(alien);
	};
	return alien_alive;
});
//checking when aliens reaches the background
aliens = aliens.filter(function (alien) {
	var alien_alive = true;
	if(alien.y > background.height - alien.height) {
		alien_alive = false;
		//g.wait(1000, () => g.remove(alien));
		g.remove(alien);
	};
	*/
	/*
	   Creating obstacles
	   */

	function createWall() {
		walls = [];

		// NUBMER 2 wall
		for (var i = 0; i < 40; i++) {
			let wall = g.sprite("../images/wall.jpg");

			let x = 1/4*background.width;
			// avoding collision

			// let y = g.randomInt(0,0);
			let y = (1/4*background.height) + 6 * i;
			wall.x = x;
			wall.y = y
				walls.push(wall);

		}
		// NUMBER 3 wall
		for (var i = 0; i < 40; i++) {
			let wall = g.sprite("../images/wall.jpg");
			let x = 1/4*background.width + 8;
			let y = (1/4*background.height) + 6 * i;
			wall.x = x;
			wall.y = y
				walls.push(wall);
		}

		//NUMBER 6 wall
		for (var i = 0; i < 40; i++) {
			let wall = g.sprite("../images/wall.jpg");

			let x = background.width - (background.width*1/4);
			// avoding collision

			// let y = g.randomInt(0,0);
			let y = (1/4*background.height) + 6 * i;
			wall.x = x;
			wall.y = y
				walls.push(wall);

		}
		// console.log("walls length is " + walls.length );
		// NUMBER 7  wall
		for (var i = 0; i < 40; i++) {
			let wall = g.sprite("../images/wall.jpg");
			let x = background.width - (background.width*1/4) - 8;
			let y = (1/4*background.height) + 6 * i;
			wall.x = x;
			wall.y = y
				walls.push(wall);
		}
		for (var i = 0; i < 40; i++) {
			let wall = g.sprite("../images/wall.jpg");
			let x = background.width - (background.width*1/4) - 8;
			let y = (1/4*background.height) + 6 * i;
			wall.x = x;
			wall.y = y
				walls.push(wall);
		}




	}