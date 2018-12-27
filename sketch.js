var balloons;
var confettiArr;
var gravity;
var balloonSize;
var confettiSize;
var numConfettiParticles;

function setup() {
	createCanvas(400, 400);
	
	gravity = createVector(0,-9.8);
	balloonSize = 40;
	confettiSize = 10;
	numConfettiParticles = 20;
	
	balloons = [];
	confettiArr = [];
	
	for(var i = 0; i < 36; i++) {
		balloons[i] = new Balloon(width/2+random(-width/2,width/2),height+random(balloonSize,1000),balloonSize);
	}	
}

function draw() {
	background(240);
	noStroke();
	for(var i = balloons.length -1; i >= 0; i--) {
		if(balloons[i].position.y > balloons[i].s/2){
			balloons[i].applyForce(gravity);
			balloons[i].update();
			balloons[i].show();
		}
		else {
			confettiArr = confettiArr.concat(balloons[i].explode());
			balloons.splice(i,1);
		}
	}
	
	for(i = 0; i < confettiArr.length; i++) {
		if(confettiArr[i].position.y < height+confettiArr[i].s && confettiArr[i].alpha > 0) {
			confettiArr[i].applyForce(gravity);
			confettiArr[i].update();
			confettiArr[i].show();
		}
		else {
			confettiArr.splice(i,1);
		}
	}
	
	// stop loop if no more balloons or confetti
	if(balloons.length === 0 && confettiArr.length === 0) {
		noLoop();
	}
}

function mouseClicked() {
	// get mouse location and determine which balloon was clicked
	for(var i = balloons.length -1; i >= 0; i--) {
		if(dist(mouseX,mouseY,balloons[i].position.x,balloons[i].position.y) < balloons[i].s/2) {
			//console.log("Popped a Balloon!");
			for(var j = 0; j < numConfettiParticles; j++) {
				confettiArr.push(new ConfettiParticle(balloons[i]));
			}
			balloons.splice(i,1);
		}
	}
}

class Balloon {
	constructor(x,y,s) {
		this.s = s
		this.c = color(random(256),random(256),random(256));
		this.mass = 0.0001;
		this.position = createVector(x,y);
		this.velocity = createVector(0,0);
		this.acceleration = createVector(0,0);
	}
	show() {
		fill(this.c)
		ellipse(this.position.x,this.position.y,this.s);
	}
	// F = M * A => A = F / M
	applyForce(force) {
		var f = p5.Vector.mult(force,this.mass);
		this.acceleration.add(f);
	}	
	update() {
		this.velocity.add(this.acceleration);
		var r = createVector(random(-0.01,0.01),0);
		this.velocity.add(r);
		this.position.add(this.velocity);
		// clear acceleration
		this.acceleration.mult(0);
	}
	explode() {
		// create an array of confetti particles and return it
		var balloonConfetti = [];
		for(var i = 0; i < numConfettiParticles; i++) {
			confettiArr.push(new ConfettiParticle(this));
		}
		return balloonConfetti;
	}
}

class ConfettiParticle {
	constructor(parentBalloon) {
		this.alpha = 255;
		this.s = confettiSize+random(-4,4);
		//this.c = color(random(50,256),random(50,256),random(50,256));
		this.conColor = createVector(random(0,255),random(0,255),random(255));
		this.mass = -15;
		if(random(0,1) >= 0.5) {
			this.position = createVector(parentBalloon.position.x+random(0,parentBalloon.s),parentBalloon.position.y+random(-parentBalloon.s,parentBalloon.s));
			this.acceleration = createVector(random(0,parentBalloon.s),random(-parentBalloon.s,parentBalloon.s));
		}
		else {
			this.position = createVector(parentBalloon.position.x+random(0,-parentBalloon.s),parentBalloon.position.y+random(-parentBalloon.s,parentBalloon.s));
			this.acceleration = createVector(random(0,-parentBalloon.s),random(-parentBalloon.s,parentBalloon.s));
		}
		this.velocity = createVector(0,0);
	}
	show() {
		//fill(this.alpha)
		fill(this.conColor.x,this.conColor.y,this.conColor.z,this.alpha);
		ellipse(this.position.x,this.position.y,this.s);
	}
	// F = M * A => A = F / M
	applyForce(force) {
		var f = p5.Vector.div(force,this.mass);
		this.acceleration.add(f);
	}	
	update() {
		this.velocity.add(this.acceleration);
		this.velocity.mult(0.75);
		if(this.velocity.x < 0) {
			var r = createVector(random(-0.1,0),0);
			this.velocity.add(r);
		}
		else {
			var r = createVector(random(0,0.1),0);
			this.velocity.add(r);
		}
		this.position.add(this.velocity);
		// clear acceleration
		this.acceleration.mult(0);
		this.alpha = this.alpha - 2;
	}
}