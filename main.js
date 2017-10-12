
var canvas;
	var canvasContext;
	var ballX = 50;
	var ballSpeedX = 10;
        var ballY = 50;
	var ballSpeedY = 6;

	var player1score = 0;
	var player2score = 0;
	const WINNING_SCORE = 3;

var showingWinScreen = false;

	var paddle1Y = 250;
	var paddle2Y = 250;
	const PADDLE_HEIEGHT = 100;

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
			player1score =0;
			player2score =0;
			showingWinScreen =false;
		}
	}

	window.onload = function() {
		canvas = document.getElementById("gameCanvas");
		canvasContext = canvas.getContext('2d');
		var framesPerSecond = 40;
		setInterval(function(){
			moveEverything();
			drawEverything();
		}, 1000/framesPerSecond);
		canvas.addEventListener('mousedown', handleMouseClick);
		canvas.addEventListener('mousemove', function(evt){
			var mousePos = calculateMousePos(evt);
				paddle1Y = mousePos.y - PADDLE_HEIEGHT/2;
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
		var paddle2YCenter = paddle2Y + (PADDLE_HEIEGHT/2);
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


		if(ballX > canvas.width - 30){ //this give the illusion of collision
			if(ballY > paddle2Y &&
				ballY < paddle2Y+PADDLE_HEIEGHT) {
				ballSpeedX = -ballSpeedX;
        ballX = canvas.width - 30;

      }
			else{
					player1score++;
					ballReset();

		}}
		if(ballX < 30){ //this give the illusion of collision
			//
			if(ballY > paddle1Y &&
				ballY < paddle1Y+PADDLE_HEIEGHT) {
				ballSpeedX = -ballSpeedX;
        ballX = 30;
      }
			else{
					player2score++;
					ballReset();

		}}
    ballX += ballSpeedX;
		if(ballY > canvas.height){
			ballSpeedY = -ballSpeedY;

		}
		if(ballY < 0){
			ballSpeedY = -ballSpeedY;
		}

		ballY += ballSpeedY;
	}


	function drawNet(){
		for(var i=0; i<canvas.height; i+=40) {
			colorRect(canvas.width/2 - 1, i, 2,20,'white');
		}
	}
	function drawEverything() {
		colorRect(0, 0, canvas.width, canvas.height, 'green');  //blank screen
		if(showingWinScreen){
			canvasContext.fillStyle = 'white';
			if(player1score >= WINNING_SCORE) {
				canvasContext.fillText("Left Player Won!", 350, 200);
			}
			else if(player2score >= WINNING_SCORE) {
				canvasContext.fillText("Right Player Won!", 350, 200);
			}
			canvasContext.fillText('Click To Continue', 350, 500);
			return;
		}
		drawNet();
		colorRect(0, paddle1Y, 10, PADDLE_HEIEGHT,'white')	//left player paddle
		colorRect(canvas.width-10, paddle2Y, 10, PADDLE_HEIEGHT,'white')
		colorCircle(ballX, ballY, 10,'white'); //draws the ball
		canvasContext.fillText(player1score, 100, 100);
		canvasContext.fillText(player2score, canvas.width-100, 100)

	}

	function colorRect(leftX,topY, width,height, drawColor){
		canvasContext.fillStyle = drawColor;
		canvasContext.fillRect(leftX,topY, width,height);
	}

	function colorCircle(centerX, centerY, radius, drawColor){
		canvasContext.fillStyle = drawColor;
		canvasContext.beginPath();
		canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
		canvasContext.fill();
	}
