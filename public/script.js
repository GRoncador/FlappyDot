const canvas = document.getElementById('canvas');
const scoreNameInput = document.getElementById('score-name-input');
const ctx = canvas.getContext('2d');
const db = firebase.database();
const game = {

    data : {

        mode : 'solo',
        currentScreen : 'initial',
    
        player : [],
        computerBots : [],
        pipes : [],
        
        score : 0,
        xAcceleration : 0.001,
        xMaxSpeed : 7,
        xSpeed : 2,
    
        distanceBetweenPipes : 400,
    
        highScoresDB : [],
        namesDB : [],
        lowestHighScore : 0,
    
        _fpsTimeStamp : 0,
        _fpsCount: 0,

    },

    start() {
    
        this.resetGame();
        this.data.currentScreen = 'game';
        scoreNameInput.style.setProperty('display','none');
    
        this.data.player.push(new Pixel());
    
        if (this.data.mode == 'vs computer') {
    
            this.data.computerBots.push(new AI());
            
        }
    
        this.data.pipes.push(new Pipe())
    
        gameLoop();
    
    },

    updateGameSpeed() {

        if (this.data.xSpeed + this.data.xAcceleration <= this.data.xMaxSpeed) {

            this.data.xSpeed += this.data.xAcceleration;

<<<<<<< HEAD
        } else {
=======
        this.ySpeed += this.yAcceleration
        this.yPosition += this.ySpeed

        // Limits the 'yPosition' to canvas size

        if (this.yPosition + this.height >= canvas.height + 11 * this.height) {
            
            this.yPosition = canvas.height + (11 * this.height) - this.height;
        
        } else if (this.yPosition < - 11 * this.height) {

            this.yPosition = - 11 * this.height;
>>>>>>> d85f116de3cd0980f00062d7ea8eb3e40559dd43

            this.data.xSpeed = this.data.xMaxSpeed;

        };

    },

    updatePipes() {

        if (this.data.pipes[0].xPosition <= - this.data.pipes[0].width) {

            this.data.pipes.shift();

        };
        
        while (this.data.pipes.length < 3) {
        
            let _lastPairIndex = this.data.pipes.length - 1;
            let _xPosition = this.data.pipes[_lastPairIndex].xPosition + this.data.pipes[_lastPairIndex].width + this.data.distanceBetweenPipes;
        
            this.data.pipes.push(new Pipe(_xPosition));

        };

    },

<<<<<<< HEAD
    resetGame() {
=======
    checkHit() {

        // // hit ground
        // if (computerDot.yPosition + computerDot.height >= canvas.height) {

        //     return true;
            
        // // hit obstacle
        // } else 
        
        if (obstacle.pairs[0].x <= computerDot.xPosition + computerDot.width && obstacle.pairs[0].x + obstacle.width >= computerDot.xPosition) {
    
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
>>>>>>> d85f116de3cd0980f00062d7ea8eb3e40559dd43

        this.data.score = 0;
        this.data.xSpeed = 2;
        this.data._fpsCount = 0;
        this.data._fpsTimeStamp = Date.now();

        this.data.player = [];
        this.data.computerBots = [];
        this.data.pipes = [];

    },

    fpsCalculate() {

        if (Date.now() - this.data._fpsTimeStamp >= 5000) {

            this.data._fpsTimeStamp = Date.now();

            document.getElementById('fps').innerText = `FPS: ${this.data._fpsCount/5}`;

            this.data._fpsCount = 0;

        } else {

            this.data._fpsCount ++

        }

    },

    updateScore() {

        this.data.score ++;

        document.getElementById('score').innerText = `Score: ${this.data.score}`;

    },

    getHighScores() {

        let _rawNamesDB = [];
        let _rawHighScoresDB = [];

        db.ref('names').get()
        .then((_snapshot) => {_rawNamesDB = Object.entries(_snapshot.val())})
        .catch((_error) => {console.error(_error)});
        
        db.ref('highScores').get()
        .then((_snapshot) => {
            
            _rawHighScoresDB = Object.entries(_snapshot.val());
            
            this.data.highScoresDB = _rawHighScoresDB.sort( (a,b) => a[1] - b[1] ).slice(-10);

            this.data.lowestHighScore = this.data.highScoresDB[0][1];
            
            this.data.highScoresDB.forEach( (_scoreData, _index) => {
                
                for (i in _rawNamesDB) {

                    if (_rawNamesDB[i][0] == _scoreData[0]) {

                        this.data.highScoresDB[_index][0] = _rawNamesDB[i][1];
                        
                        break;

                    };
                    
                };

                this.data.highScoresDB[_index][1] = "0".repeat(6 - this.data.highScoresDB[_index][1].toString().length) + this.data.highScoresDB[_index][1].toString();
                
            });

            this.data.highScoresDB.reverse();
    
            this.showHighScores();
            
        }).catch((_error) => {console.error(_error)});
    
    },
    
    showHighScores() {
    
        for (_i in this.data.highScoresDB) {
    
            document.getElementById('li-' + _i).innerText = this.data.highScoresDB[_i][1] + '....' + this.data.highScoresDB[_i][0];
    
        };
    
    },
    
    sendHighScore() {

        let _keyID = db.ref().push().key;
        let _scoreObj = {};
        let _playerObj = {};

        _scoreObj[_keyID] = this.data.score;
        _playerObj[_keyID] = scoreNameInput.value.toUpperCase();
        
        firebase.database().ref('highScores').update(_scoreObj);
        firebase.database().ref('names').update(_playerObj);

        drawScreen.highScoreSent()

        this.getHighScores()
        
    },

};

function gameLoop() {

    game.updatePipes();

    if (!game.data.player[0].checkHit(game.data.pipes)) {

        drawScreen.clear();

        game.updateGameSpeed();
        game.updateScore();
        game.fpsCalculate();

        if (game.data.mode == 'vs computer') {

            game.data.computerBots.forEach((_bot) => {

                if (!_bot.isDead) {

                    _bot.think(game.data.pipes, game.data.xSpeed);
                    _bot.move();
                    _bot.show();

                    if (_bot.checkHit(game.data.pipes)) {

                        _bot.isDead = true;
                        _bot.score = game.data.score;

                    };

                };

            });
            
        };

        game.data.player[0].move();
        game.data.player[0].show();

        game.data.pipes.forEach((_pipe) => {
            
            _pipe.move(game.data.xSpeed);
            _pipe.show();
        
        });
        
        drawScreen.instructions();

        requestAnimationFrame(gameLoop);

    } else {

        let _aliveBotsNumber = game.data.computerBots.filter(_bot => !_bot.isDead).length;    
        drawScreen.gameOver(_aliveBotsNumber);

        if (game.data.score > game.data.lowestHighScore || game.data.highScoresDB.length < 10) {
    
            drawScreen.highScoreGameOver();
    
        }
<<<<<<< HEAD
                
=======
    
        game.updateScore();
            
    }

};

function isGameOver() {

    // // hit ground
    // if (playerDot.yPosition + playerDot.height >= canvas.height) {

    //    return true;
        
    // // hit obstacle
    // } else 
    
    if (obstacle.pairs.length > 0 && obstacle.pairs[0].x <= playerDot.xPosition + playerDot.width && obstacle.pairs[0].x + obstacle.width >= playerDot.xPosition) {

        if (playerDot.yPosition <= obstacle.pairs[0].y || playerDot.yPosition + playerDot.height >= obstacle.pairs[0].y + obstacle.space){

            return true;

        }      

>>>>>>> d85f116de3cd0980f00062d7ea8eb3e40559dd43
    }

};

canvas.addEventListener('mousedown', (_event) => {

    if (_event.button == 0){

        let _x = _event.x - canvas.getBoundingClientRect().x;
        let _y = _event.y - canvas.getBoundingClientRect().y;

        if (game.data.currentScreen == 'initial') {

            if (_x >= 150 && _x <= 380 && _y >= 195 && _y <= 245) {
                
                drawScreen.activateButton('solo');
                game.data.mode = 'solo';
                
            } else if (_x >= 420 && _x <= 650 && _y >= 195 && _y <= 245) {

                drawScreen.activateButton('vs computer');
                game.data.mode = 'vs computer';
                
            } else if (_x >= 323 && _x <= 473 && _y >= 395 && _y <= 445) {

                game.start();
                
            }

        } else if (game.data.currentScreen == 'game') {

            game.data.player[0].jump();
    
        } else if (game.data.currentScreen == 'game over') {

            if (_x >= 300 && _x <= 500 && _y >= 395 && _y <= 445) {
                
                game.start();

            } else if (_x >= 600 && _x <= 700 && _y >= 395 && _y <= 445) {

                drawScreen.clear();
                scoreNameInput.style.setProperty('display','none');
                drawScreen.initial();
            }

        } else if (game.data.currentScreen == 'game over - high score') {

            if (_x >= 300 && _x <= 500 && _y >= 395 && _y <= 445) {
                
                game.start();

            }  else if (_x >= 600 && _x <= 700 && _y >= 395 && _y <= 445) {

                drawScreen.clear();
                scoreNameInput.style.setProperty('display','none');
                drawScreen.initial();

            } else if (_x >= 525 && _x <= 675 && _y >= 285 && _y <= 318) {
                
                if (scoreNameInput.value == '') {

                    drawScreen.highScoreGameOver(true);

                } else {

                    game.sendHighScore();

                };

            };

        };

    };

});