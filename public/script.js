var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var db = firebase.database();

var game = {

    gameMode : 'solo',
    currentScreen : 'initial',

    score : 0,
    level : 0,
    levelChange : 500,
    xAcceleration : 1 / 500,
    xStartSpeed : 2,
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

        game.level = parseInt(game.score / game.levelChange);

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
    yStartPosition : 50,
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
            ctx.strokeStyle = 'black'
            ctx.strokeRect(this.pairs[obst].x, (this.pairs[obst].y - this.height), this.width, this.height);

            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.pairs[obst].x, (this.pairs[obst].y + this.space), this.width, this.height);
            ctx.strokeStyle = 'black'
            ctx.strokeRect(this.pairs[obst].x, (this.pairs[obst].y + this.space), this.width, this.height);

            this.pairs[obst].x -= game.xSpeed;

        }

        this.distance = this.distance + game.xSpeed;

        if (game.level < 8) {
            game.xSpeed += game.xAcceleration;
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
    playerDot.ySpeed = 0;
    game.xSpeed = game.xStartSpeed;

    obstacles.pairs = [];
    obstacles.distance = obstacles.frequency;

    game.currentScreen = 'game'
    game.score = 0;
    game.fpsValue = 0;
    game.fpsTimeStamp = Date.now();

    document.getElementById('score-name-input').style.setProperty('display','none');

    gameLoop();

}

function gameLoop() {

    if (!isGameOver()) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        playerDot.moveDot();
        
        obstacles.moveObstacles();
        
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
    } else if (obstacles.pairs.length > 0 && obstacles.pairs[0].x <= playerDot.xPosition + playerDot.width && obstacles.pairs[0].x + obstacles.width >= playerDot.xPosition) {

        if (playerDot.yPosition <= obstacles.pairs[0].y || playerDot.yPosition + playerDot.height >= obstacles.pairs[0].y + obstacles.space){

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