var canvas;
var ctx;
var ballX = 50;
var ballSpeedX = 6;
var ballY = 50;
var ballSpeedY = 6;

var player1score = 0;
var player2score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;

var reflectionCount = 0; // amount of times the player paddle reflected the ball
var canvasCenterY;
var canvasCenterX;

function calculateMousePos(evt) {
	var rect  = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return{
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt) {
	if(showingWinScreen){
		player1score = 0;
		player2score = 0;
		showingWinScreen =false;
	}
}

window.onload = function() {
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext('2d');
	var framesPerSecond = 75;
	setInterval(function(){
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);
	canvas.addEventListener('mousedown', handleMouseClick);
	canvas.addEventListener('mousemove', function(evt){
		var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
	});

	canvasCenterX = canvas.width / 2.0;
	canvasCenterY = canvas.height / 2.0;
}

function ballReset() {
	if(player1score >= WINNING_SCORE || player2score >= WINNING_SCORE){
		
		showingWinScreen = true;
	}
	ballSpeedX = -ballSpeedX
	ballX = canvas.width/2;
	ballY = canvas.height/2;

	reflectionCount = 0;
}

function computerMovement() {

	// vertical center of right paddle
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	
	const baseSpeed = 10.0; 	// normal speed of right paddle
	const slowSpeed = 5.0;  	// slower speed
	var speed = 0.0;        	// speed applied to paddle this frame
	var doUseSlowSpeed = false; // whether the ball uses base or slow speed

	// ball moves to player paddle and is on left side of canvas
	if (ballSpeedX < 0 && ballX < canvas.width / 2) {

		// move paddle towards center of play field
		if (paddle2Y < canvasCenterY - 10)
			speed = slowSpeed;
		else if (paddle2Y > canvasCenterY + 10)
			speed = -slowSpeed;

	} else { // follow ball 

		// depending on the reflection count, improve the probability of an slower moving paddle
		// when the ball is close
		doUseSlowSpeed = randomNumber(Math.min(reflectionCount * 6.0, 70.0), 100) > 80;
		
		// paddle is above the ball
		if(paddle2YCenter < ballY - 10) {

			// ball is close 
			if(ballX > canvas.width - 120 && doUseSlowSpeed)
				speed = slowSpeed;
			else
				speed = baseSpeed;

		} else if (paddle2YCenter > ballY + 10) { // paddle is below the ball

			// ball is close
			if(ballX > canvas.width - 120 && doUseSlowSpeed)
				speed = -slowSpeed;
			else
				speed = -baseSpeed;
		}		
	}

	// generally move ball slower when ball is far away
	// paddle speed increases exponentially as ball gets close
	speed *= Math.max(0.25, Math.pow((ballX / canvas.width), 2));

	// move paddle by determined speed
	paddle2Y += speed;
}

function moveEverything(){
	if(showingWinScreen){
		return;
	}
	computerMovement();
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if(ballX > canvas.width){
		if(ballY > paddle2Y && 
			ballY < paddle2Y+PADDLE_HEIGHT) {
				ballSpeedX = -ballSpeedX;
		} else {
				player1score++;				
				ballReset();
		}
	}
	if(ballX < 0){
		//
		if(ballY > paddle1Y && 
			ballY < paddle1Y+PADDLE_HEIGHT) {
				ballSpeedX = -ballSpeedX;
				reflectionCount++;
		} else {
				player2score++;
				ballReset();
				
	}}
	if(ballY > canvas.height){
		ballSpeedY = -ballSpeedY;

	}
	if(ballY < 0){
		ballSpeedY = -ballSpeedY;
	}
}


function drawNet(){
	for(var i=0; i<canvas.height; i+=40) {
		colorRect(canvas.width/2 - 1, i, 2,20,'white');
	}
}
function drawEverything() {	
	colorRect(0, 0, canvas.width, canvas.height, 'green');  //blank screen
	if(showingWinScreen){
		ctx.fillStyle = 'white'
		ctx.fillRect(0, 250, canvas.width, 115);
		ctx.fillStyle = 'green';
		if(player1score >= WINNING_SCORE) {
			ctx.textAlign = "center";
			ctx.font = "30px Arial";
			ctx.fillText("Left Player Won!", canvas.width/2, canvas.height/2);
		}
		else if(player2score >= WINNING_SCORE) {
			ctx.textAlign = "center";
			ctx.font = "30px Arial";
			ctx.fillText("Right Player Won!", canvas.width/2, canvas.height/2);
		}
		ctx.textAlign = "center";
		ctx.font = "18px Arial";
		ctx.fillText('Continue', canvas.width/2, canvas.height/2 + 40);
		return;
	}
	drawNet();
	colorRect(0, paddle1Y, 10, PADDLE_HEIGHT,'white')	//left player paddle	
	colorRect(canvas.width-10, paddle2Y, 10, PADDLE_HEIGHT,'white')
	colorCircle(ballX, ballY, 10,'white'); //draws the ball
	ctx.font = "30px Courier";
	ctx.fillText(player1score, 50, 50);
	ctx.fillText(player2score, canvas.width-50, 50)
	
}

function colorRect(leftX,topY, width,height, drawColor){
	ctx.fillStyle = drawColor;
	ctx.fillRect(leftX,topY, width,height);
}

function colorCircle(centerX, centerY, radius, drawColor){
	ctx.fillStyle = drawColor;
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0,Math.PI*2, true);
	ctx.fill();
}

function randomNumber(min, max) {
	return Math.floor((Math.random() * max) + min);
}