var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var db = firebase.database();

var game = {

    gameMode : 'solo',
    currentScreen : 'initial',

    score : 0,
    xAcceleration : 0.0015,
    xStartSpeed : 2,
    xMaxSpeed : 8,
    xSpeed : 0,

    highScoresDB : [],
    namesDB : [],
    lowestHighScore : 0,

    fpsTimeStamp : 0,
    fpsCount: 0,

    fpsCalculate() {

        if (Date.now() - game.fpsTimeStamp >= 5000) {

            game.fpsTimeStamp = Date.now();

            document.getElementById('fps').innerText = `FPS: ${game.fpsCount/5}`;

            game.fpsCount = 0;

        } else {

            game.fpsCount ++

        }

    },

    updateScore() {

        document.getElementById('score').innerText = `Score: ${this.score}`;

    },

    getHighScores() {

        let rawNamesDB = [];
        let rawHighScoresDB = [];

        db.ref('names').get().then((snapshot) => {

            rawNamesDB = Object.entries(snapshot.val());

        }).catch((error) => {console.error(error)})
        
        db.ref('highScores').get().then((snapshot) => {
            
            rawHighScoresDB = Object.entries(snapshot.val());
            
            game.highScoresDB = rawHighScoresDB.sort( (a,b) => a[1] - b[1] ).slice(-10)

            game.lowestHighScore = game.highScoresDB[0][1];
            
            game.highScoresDB.forEach( function(scoreData,index) {
                
                for (i in rawNamesDB) {

                    if (rawNamesDB[i][0] == scoreData[0]) {

                        game.highScoresDB[index][0] = rawNamesDB[i][1];
                        
                        break;

                    }
                    
                }

                game.highScoresDB[index][1] = "0".repeat(6 - game.highScoresDB[index][1].toString().length) + game.highScoresDB[index][1].toString();
                
            })

            game.highScoresDB.reverse();
    
            game.showHighScores();
            
        }).catch((error) => {console.error(error)})
    
    },
    
    showHighScores() {
    
        for (i in game.highScoresDB) {
    
            document.getElementById('li-' + i).innerText = game.highScoresDB[i][1] + '....' + game.highScoresDB[i][0];
    
        }
    
    },
    
    sendHighScore() {

        let keyID = db.ref().push().key;
        let scoreObj = {};
        let playerObj = {};

        scoreObj[keyID] = game.score;
        playerObj[keyID] = document.getElementById('score-name-input').value.toUpperCase();
        
        firebase.database().ref('highScores').update(scoreObj);
        firebase.database().ref('names').update(playerObj);

        drawScreen.highScoreSent()

        game.getHighScores()
        
    },

}

var playerDot = {

    // style
    xPosition : 50,
    yStartPosition : 150,
    yPosition : 50,
    width : 30,
    height : 30,
    fillStyle : '#ffd000',

    // animation
    yAcceleration : 0.25,
    ySpeed : 0,

    moveDot() {

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
        ctx.strokeStyle = 'black'
        ctx.strokeRect(this.xPosition, this.yPosition, this.width, this.height);

    },

    jump() {

        this.ySpeed = -6.25;

    }
};

var computerDot = {

    // style
    xPosition : 50,
    yStartPosition : 150,
    yPosition : 50,
    width : 30,
    height : 30,
    fillStyle : '#00000030',

    // animation
    yAcceleration : 0.25,
    ySpeed : 0,

    // ability
    clicksPerSecond : 5,
    lastClickTimeStamp : 0,

    isDead : false,
    score : 0,


    think() {
        
        if (obstacle.pairs[0].x + obstacle.width - game.xSpeed > computerDot.xPosition) {
            
            var nextObstacleIndex = 0;
            
        } else {
            
            var nextObstacleIndex = 1;
        
        }

            if (obstacle.pairs[nextObstacleIndex+1].y < obstacle.pairs[nextObstacleIndex].y) {

                var maxHeigh = 16 + 75; // jump heigh = 75px

            } else {

                var maxHeigh = obstacle.space - computerDot.height - 16;

            }
        
        if (computerDot.yPosition - obstacle.pairs[nextObstacleIndex].y >= maxHeigh) {
            
            if (Date.now() - this.lastClickTimeStamp >= 1000 / this.clicksPerSecond) {
                
                this.jump();
                
                //playerDot.jump();
                
                this.lastClickTimeStamp = Date.now();
                
            };
            
        };

    },

    checkHit() {

        // hit ground
        if (computerDot.yPosition + computerDot.height >= canvas.height) {

            return true;
            
        // hit obstacle
        } else if (obstacle.pairs[0].x <= computerDot.xPosition + computerDot.width && obstacle.pairs[0].x + obstacle.width >= computerDot.xPosition) {
    
            if (computerDot.yPosition <= obstacle.pairs[0].y || computerDot.yPosition + computerDot.height >= obstacle.pairs[0].y + obstacle.space){
    
                return true;
    
            }      
    
        }
    
        // hit nothing
        return false; 

    },

    moveDot() {

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
        ctx.strokeStyle = '#00000040'
        ctx.strokeRect(this.xPosition, this.yPosition, this.width, this.height);

    },

    jump() {

        this.ySpeed = -6.25;

    }
};

var obstacle = {

    height : canvas.height,
    width : 60,
    space : 200,
    frequency : 400,
    distance : 0,
    fillStyle : '#71BF2E',

    pairs : [],

    createNewPair(xPosition) {

        var yValue = parseInt(Math.random() * (canvas.height - this.space));

        this.pairs.push({'x' : xPosition, 'y' : yValue});
        
    },

    moveObstacles() {



        while (obstacle.pairs.length < 3) {

            var lastPairIndex = obstacle.pairs.length - 1;
            var xPosition = obstacle.pairs[lastPairIndex].x + obstacle.frequency;

            obstacle.createNewPair(xPosition);        

            //this.distance = 0;

        }

        // if (this.distance >= this.frequency) {
        
        //     var yValue = parseInt(Math.random() * (canvas.height - this.space));

        //     this.pairs.push({'x' : canvas.width, 'y' : yValue});

        //     this.distance = 0;

        // }

        if (this.pairs.length > 0 && this.pairs[0].x < - this.width) {

            this.pairs.shift();

        }

        for (var obst in this.pairs) {
            
            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.pairs[obst].x, (this.pairs[obst].y - this.height), this.width, this.height);
            ctx.strokeStyle = 'black'
            ctx.strokeRect(this.pairs[obst].x, (this.pairs[obst].y - this.height), this.width, this.height);

            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.pairs[obst].x, (this.pairs[obst].y + this.space), this.width, this.height);
            ctx.strokeStyle = 'black'
            ctx.strokeRect(this.pairs[obst].x, (this.pairs[obst].y + this.space), this.width, this.height);

            this.pairs[obst].x -= game.xSpeed;

        }

        this.distance = this.distance + game.xSpeed;

        if (game.xSpeed + game.xAcceleration <= game.xMaxSpeed) {

            game.xSpeed += game.xAcceleration;

        } else {

            game.xSpeed = game.xMaxSpeed;

        }


    },

}

var drawScreen = {

    initial() {

        game.currentScreen = 'initial'

        // white background
            ctx.fillStyle = '#ffffffb5'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

        // yellow button - 'Play Solo'
            ctx.fillStyle = '#ffd000'    
            ctx.fillRect(150, 195, 230, 50)

            ctx.strokeStyle = '#b48912'
            ctx.strokeRect(150, 195, 230, 50)

        // grey button - 'Multiplayer'
            ctx.fillStyle = '#c7c7c7'
            ctx.fillRect(420,195, 230, 50)

            ctx.strokeStyle = '#313131'
            ctx.strokeRect(420, 195, 230, 50)

        // red button - 'START'
            ctx.fillStyle = '#ff6161'
            ctx.fillRect(323, 395, 150, 50)

            ctx.strokeStyle = '#af2323'
            ctx.strokeRect(323, 395, 150, 50)
        
        // text '(coming soon)'
            ctx.textAlign = "center";
            ctx.fillStyle = '#313131'
            ctx.font = "20px 'VT323', monospace";
            ctx.fillText("(coming soon)", canvas.width*2/3, 265);

        // text 'Flappy Pixel'
            ctx.fillStyle = 'black'
            ctx.textAlign = "center";
            ctx.font = "80px 'VT323', monospace";
            ctx.fillText("Flappy Pixel", canvas.width/2, 100);

        // text 'Solo'
            ctx.font = "40px 'VT323', monospace";
            ctx.fillText("Solo", canvas.width/3, 230);

        // text 'START'
            ctx.fillStyle = 'black'
            ctx.fillText("START", canvas.width/2, 430);

        // text 'Multiplayer'
            ctx.fillStyle = '#8d8d8d'
            ctx.fillText("Multiplayer", canvas.width*2/3, 230);    
    },

    instructions() {

        if (game.currentScreen == 'game' && game.score <= 100) {

            ctx.textAlign = "center";
            ctx.fillStyle = 'black'
            ctx.font = "50px 'VT323', monospace";
            ctx.fillText("1 - Click to jump 🖱️ ⇡", canvas.width/2, canvas.height/2);

        } else if (game.currentScreen == 'game' && game.score <= 300) {

            ctx.textAlign = "center";
            ctx.fillStyle = 'black'
            ctx.font = "50px 'VT323', monospace";
            ctx.fillText("2 - Avoid the ground and obstacles", canvas.width/2, canvas.height/2);

        }
    },

    gameOver() {

        game.currentScreen = 'game over'

        // white background
            ctx.fillStyle = '#ffffffb5'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

        // text 'GAME OVER'    
            ctx.fillStyle = 'black'    
            ctx.textAlign = "center";
            ctx.font = "100px 'VT323', monospace";
            ctx.fillText("GAME OVER", canvas.width/2, 100);

        // text 'your score........XXX'
            ctx.fillStyle = 'black'    
            ctx.textAlign = "center";
            ctx.font = "40px 'VT323', monospace";
            ctx.fillText(`Your score is ......... ${game.score}`, canvas.width/2, 170);

        // red button - 'PLAY AGAIN'
            ctx.fillStyle = '#ff6161'
            ctx.fillRect(300, 395, 200, 50)

            ctx.strokeStyle = '#af2323'
            ctx.strokeRect(300, 395, 200, 50)

        // text 'PLAY AGAIN'
            ctx.fillStyle = 'black'
            ctx.fillText("PLAY AGAIN", canvas.width/2, 430);

        // grey button - 'MENU'
            ctx.fillStyle = '#9a9a9a'
            ctx.fillRect(600, 395, 100, 50)

            ctx.strokeStyle = 'black'
            ctx.strokeRect(600, 395, 100, 50)

        // text 'MENU'
            ctx.fillStyle = 'black'
            ctx.fillText("MENU", 650, 430);

    },

    highScoreGameOver() {

        game.currentScreen = 'game over - high score'

        // yellow box
            ctx.fillStyle = '#ffd000'    
            ctx.fillRect(100, 205, 600, 150)

            ctx.strokelStyle = 'black'    
            ctx.strokeRect(100, 205, 600, 150)

        // text 'New High Score!'
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.font = "40px 'VT323', monospace";
            ctx.fillText("New High Score!", canvas.width/2, 245);

        // text 'Enter your name:'
            ctx.fillStyle = 'black'    
            ctx.font = "25px 'VT323', monospace";
            ctx.fillText('Enter your name:', 195, 307);

        // grey button 'Send Score'
            ctx.fillStyle = '#9a9a9a'
            ctx.fillRect(525, 285, 150, 33)

            ctx.strokeStyle = 'black'
            ctx.strokeRect(525, 285, 150, 33)

        // text 'Send Score'
            ctx.textAlign = "left";
            ctx.fillStyle = 'black'    
            ctx.font = "25px 'VT323', monospace";
            ctx.fillText('Send Score', 550, 307);

        // name input
            document.getElementById('score-name-input').style.setProperty('display','block');
    },

    highScoreSent() {

        game.currentScreen = 'game over'
        
        // yellow box
            ctx.fillStyle = '#ffd000'    
            ctx.fillRect(100, 205, 600, 150)

            ctx.strokelStyle = 'black'    
            ctx.strokeRect(100, 205, 600, 150)

        // text 'New High Score!'
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.font = "40px 'VT323', monospace";
            ctx.fillText("New High Score!", canvas.width/2, 245);

        // text 'Welcome to the Hall of Fame :)'
            ctx.fillStyle = 'black'
            ctx.textAlign = "center";    
            ctx.font = "25px 'VT323', monospace";
            ctx.fillText('Welcome to the Hall of Fame :)', canvas.width/2, 307);

        document.getElementById('score-name-input').style.setProperty('display','none');

    },

}

function gameStart() {

    playerDot.yPosition = playerDot.yStartPosition;
    playerDot.ySpeed = -6.25;

    computerDot.yPosition = computerDot.yStartPosition;
    computerDot.ySpeed = -6.25;
    computerDot.lastClickTimeStamp = 0;
    computerDot.isDead = false;
    computerDot.score = 0;
    
    obstacle.pairs = [];
    obstacle.distance = obstacle.frequency;
    
    game.currentScreen = 'game';
    game.score = 0;
    game.xSpeed = game.xStartSpeed;
    game.fpsValue = 0;
    game.fpsTimeStamp = Date.now();

    document.getElementById('score-name-input').style.setProperty('display','none');

    obstacle.createNewPair(canvas.width);

    gameLoop();

}

function gameLoop() {

    if (!isGameOver()) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        obstacle.moveObstacles();

        if (!computerDot.isDead) {
            
            computerDot.think();
            computerDot.moveDot();

            if (computerDot.checkHit()) {

                computerDot.isDead = true;
                computerDot.score = game.score;

            }

        }
        
        playerDot.moveDot();
        
        drawScreen.instructions();

        game.score ++;

        game.updateScore();

        game.fpsCalculate();

        requestAnimationFrame(gameLoop);

    } else {

        drawScreen.gameOver()

        if (game.score > game.lowestHighScore || game.highScoresDB.length < 10) {
    
            drawScreen.highScoreGameOver()
    
        }
    
        game.updateScore();
            
    }

};

function isGameOver() {

    // hit ground
    if (playerDot.yPosition + playerDot.height >= canvas.height) {

       return true;
        
    // hit obstacle
    } else if (obstacle.pairs.length > 0 && obstacle.pairs[0].x <= playerDot.xPosition + playerDot.width && obstacle.pairs[0].x + obstacle.width >= playerDot.xPosition) {

        if (playerDot.yPosition <= obstacle.pairs[0].y || playerDot.yPosition + playerDot.height >= obstacle.pairs[0].y + obstacle.space){

            return true;

        }      

    }

    // hit nothing
    return false;

};

canvas.addEventListener('mousedown', function(event) {

    if (event.button == 0){

        let x = event.x - canvas.getBoundingClientRect().x;
        let y = event.y - canvas.getBoundingClientRect().y;

        if (game.currentScreen == 'initial') {

            if (x >= 323 && x <= 473 && y >= 395 && y <= 445) {
                
                gameStart();

            }

        } else if (game.currentScreen == 'game') {

            playerDot.jump()
            
        } else if (game.currentScreen == 'game over') {

            if (x >= 300 && x <= 500 && y >= 395 && y <= 445) {
                
                gameStart();

            } else if (x >= 600 && x <= 700 && y >= 395 && y <= 445) {

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                document.getElementById('score-name-input').style.setProperty('display','none');

                drawScreen.initial();
            }

        } else if (game.currentScreen == 'game over - high score') {

            if (x >= 300 && x <= 500 && y >= 395 && y <= 445) {
                
                gameStart();

            }  else if (x >= 600 && x <= 700 && y >= 395 && y <= 445) {

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                document.getElementById('score-name-input').style.setProperty('display','none');

                drawScreen.initial();

            } else if (x >= 525 && x <= 675 && y >= 285 && y <= 318) {
                
                if (document.getElementById('score-name-input').value == '') {

                    ctx.textAlign = "center";
                    ctx.fillStyle = 'red'    
                    ctx.font = "bold 25px 'VT323', monospace";
                    ctx.fillText('Enter your name:', 195, 307);

                } else {

                    game.sendHighScore();

                }

            }

        }

    }

});

game.getHighScores();
drawScreen.initial();