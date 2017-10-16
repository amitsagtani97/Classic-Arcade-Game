// The area where the game will take place
var canvas;
// The context of the canvas, here the game is in 2D
var ctx;
// Setting default speed and position of the ball on the x axis
var ballX = 50;
var ballSpeedX = 2;
// Setting default speed and position of the ball on the y axis
var ballY = 50;
var ballSpeedY = 2;

// Setting current score per player
var player1score = 0;
var player2score = 0;
// Setting limit score, hitting it will stop the game
const WINNING_SCORE = 10;

// Displaying the winning screen at the end of a game
var showingWinScreen = false;

// Default player's paddle position on the y axis
var paddle1Y = 250;
var paddle2Y = 250;
// Default player's paddle height
const PADDLE_HEIGHT = 100;

// Store the last level update in a variable
var changedLevelAt = Date.now();
const SECOND = 1000;
// Setting the interval by which the speed will increase
var timeInterval = 5 * SECOND;
// Speed added to the ball at each interval
var speedAdded = 2;

// Calculating the position of the mouse relatively to the canvas
function calculateMousePos(evt) {
	var rect  = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return{
		x: mouseX,
		y: mouseY
	};
}

// If the game is over (showingWinScreen === true)
// A user's click anywhere on the canvas will set back the scores to 0 and launch a new game
function handleMouseClick(evt) {
	if(showingWinScreen){
		player1score = 0;
		player2score = 0;
		showingWinScreen = false;
	}
}

window.onload = function() {
	// Inserting the canvas in a targeted div
	canvas = document.getElementById("gameCanvas");
	// Setting the context to 2D
	ctx = canvas.getContext('2d');
	// Defining how many times the canvas will render in one second
	var framesPerSecond = 75;
	// Starting the game
	setInterval(function(){
		moveEverything();
		drawEverything();
	}, 1000 / framesPerSecond);
	// Launching the handleMouseClick fn at each mousedown event
	canvas.addEventListener('mousedown', handleMouseClick);
	// Positionning the user's paddle depending on the mouse movements
	canvas.addEventListener('mousemove', function(evt){
		var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
	});
}

// Reset the position of the ball
function ballReset() {
	// If someone hit the limit score, display the winning screen
	if (player1score >= WINNING_SCORE || player2score >= WINNING_SCORE) {
		showingWinScreen = true;
	}
	ballSpeedX = -ballSpeedX;
	// Set the ball position back to the center middle
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
}

// Reset the speed and the last level update date
function settingsReset() {
	changedLevelAt = Date.now();
	ballSpeedX = 2;
	ballSpeedY = 2;
}

// Computer AI
function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
	if (paddle2YCenter < ballY - 35) {
		paddle2Y += 6;
	} else if (paddle2YCenter > ballY + 35) {
		paddle2Y -= 6;
	}
}

function moveEverything(){
	// While the winning screen is displayed, the fn won't run
	if (showingWinScreen) {
		return;
	}

	console.log('Y : ' + ballSpeedY + ' X : ' + ballSpeedX);

	if (Date.now() > (changedLevelAt + timeInterval)) {
		if (ballSpeedX < 0) {
			ballSpeedX -= speedAdded;
		} else {
			ballSpeedX += speedAdded;
		}

		if (ballSpeedY < 0) {
			ballSpeedY -= speedAdded;
		} else {
			ballSpeedY += speedAdded;
		}

		changedLevelAt = Date.now();
	}

	computerMovement();
	// Updating the current position of the ball depending on its speed
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	// If the ball horizontal position is higher than the canvas width
	if (ballX > canvas.width) {
		// If the ball hit the computer's paddle
		if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
			// Set its speed to a negative value to throw it back to the player
			ballSpeedX = -ballSpeedX;
		} else {
			// If the computer's paddle didn't hit the ball it means that the player scored
			player1score++;
			settingsReset();
			ballReset();
		}
	}

	// Same thing but on the other side
	if (ballX < 0) {
		if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
		} else {
			player2score++;
			settingsReset();
			ballReset();
		}
	}

	if (ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}

	if (ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
}


// Drawing the game in the canvas ✏️

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
