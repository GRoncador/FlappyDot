//update
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var score = {

    value : 0,
    best : 0,
    level : 0,
    levelChange : 500,

    updateScore() {

        document.getElementById('score').innerText = `Score: ${this.value}`;

        document.getElementById('best-score').innerText = `High Score: ${this.best}`;

        this.level = parseInt(this.value / this.levelChange);

    }

}

var dot = {

    // style
    xPosition : 50,
    yStartPosition : 50,
    yPosition : 50,
    width : 30,
    height : 30,
    fillStyle : '#ffd000',


    // animation
    yAcceleration : 0.25,
    ySpeed : 0,
    xAcceleration : 1 / score.levelChange,
    xStartSpeed : 2,
    xSpeed : 0,

    moveDot() {

        //ctx.clearRect(this.xPosition, 0, this.width, canvas.height);

        this.ySpeed += this.yAcceleration
        this.yPosition += this.ySpeed

        // Limits the 'yPosition' to canvas size

        if (this.yPosition + this.height >= canvas.height) {
            
            this.yPosition = canvas.height - this.height;
        
        } else if (this.yPosition < 0) {

            this.yPosition = 0;

        }

        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.xPosition, this.yPosition, this.width, this.height);
        ctx.strokeRect(this.xPosition, this.yPosition, this.width, this.height);

    },

    jump() {

        this.ySpeed = -5;

    }
};

var obstacles = {

    height : canvas.height,
    width : 60,
    space : 200,
    frequency : 400,
    distance : 0,
    fillStyle : '#71BF2E',

    pairs : [],

    moveObstacles() {

        if (this.distance >= this.frequency) {
        
            var yValue = parseInt(Math.random() * (canvas.height - this.space));

            this.pairs.push({'x' : canvas.width, 'y' : yValue});

            this.distance = 0;

        }

        if (this.pairs.length > 0 && this.pairs[0].x < - this.width) {

            this.pairs.shift();

        }


        

        for (var obst in this.pairs) {
            
            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.pairs[obst].x, (this.pairs[obst].y - this.height), this.width, this.height);
            ctx.strokeRect(this.pairs[obst].x, (this.pairs[obst].y - this.height), this.width, this.height);

            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.pairs[obst].x, (this.pairs[obst].y + this.space), this.width, this.height);
            ctx.strokeRect(this.pairs[obst].x, (this.pairs[obst].y + this.space), this.width, this.height);

            this.pairs[obst].x -= dot.xSpeed;

        }

        this.distance = this.distance + dot.xSpeed;

        dot.xSpeed += dot.xAcceleration;

    },

}

function gameStart() {

    dot.yPosition = dot.yStartPosition;
    dot.ySpeed = 0;
    dot.xSpeed = dot.xStartSpeed;

    obstacles.pairs = [];
    obstacles.distance = obstacles.frequency;

    gameLoop();

}

function gameOver() {

    // hit ground
    if (dot.yPosition + dot.height >= canvas.height) {

       return true;
        
    // hit obstacle
    } else if (obstacles.pairs.length > 0 && obstacles.pairs[0].x <= dot.xPosition + dot.width && obstacles.pairs[0].x + obstacles.width >= dot.xPosition) {

        if (dot.yPosition <= obstacles.pairs[0].y || dot.yPosition + dot.height >= obstacles.pairs[0].y + obstacles.space){

            return true;

        }      

    }

    // hit nothing
    return false;

};

function endGame() {

    ctx.fillStyle = '#ffffffb5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'black'

    ctx.textAlign = "center";
    ctx.font = "100px 'VT323', monospace";
    ctx.fillText("GAME OVER!", canvas.width/2, canvas.height/2);

    ctx.textAlign = "center";
    ctx.font = "40px 'VT323', monospace";
    ctx.fillText("🖱️ click to play again", canvas.width/2, canvas.height*3/4);

    if (score.value > score.best) {

        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.font = "40px 'VT323', monospace";
        ctx.fillText("new high score!", canvas.width/2, canvas.height/4);
        score.best = score.value;

    }

    score.updateScore();
    score.value = 0;

}

function gameLoop() {

    if (!gameOver()) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dot.moveDot();

        obstacles.moveObstacles();

        score.value ++;

        score.updateScore();

        requestAnimationFrame(gameLoop);

    } else {

        endGame();
        
    }

};

ctx.textAlign = "center";
ctx.font = "80px 'VT323', monospace";
ctx.fillText("🖱️ click to jump ⇡", canvas.width/2, canvas.height/2);

canvas.addEventListener('mousedown', function(event) {

    if (event.button == 0){

        if (score.value == 0) {

            gameStart();

        } else {

            dot.jump()
            
        }

    }

});

