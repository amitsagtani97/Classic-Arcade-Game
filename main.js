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
		ballSpeedX = 6;
		ballSpeedY = 6;
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
	setInterval(increaseBallSpeed, 350000/framesPerSecond);	
	canvas.addEventListener('mousedown', handleMouseClick);
	canvas.addEventListener('mousemove', function(evt){
		var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
	});
}

function ballReset() {
	if(player1score >= WINNING_SCORE || player2score >= WINNING_SCORE){
		
		showingWinScreen = true;
	}
	ballSpeedX = -ballSpeedX
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter < ballY-35){
		paddle2Y += 6;			
	}
	else if(paddle2YCenter > ballY+35)
		paddle2Y -= 6;
	
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
			ballY < paddle2Y+PADDLE_HEIGHT)
			ballSpeedX = -ballSpeedX;
		else{
				player1score++;
				ballReset();
				
	}}
	if(ballX < 0){
		//
		if(ballY > paddle1Y && 
			ballY < paddle1Y+PADDLE_HEIGHT)
			ballSpeedX = -ballSpeedX;
		else{
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

function increaseBallSpeed() {
	if (ballSpeedX < 0) {
		ballSpeedX--;
	} else {
		ballSpeedX++;
	}
	if (ballSpeedY < 0) {
		ballSpeedY--;
	} else {
		ballSpeedY++;
	}
}
