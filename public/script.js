const scoreNameInput = document.getElementById('score-name-input');
const ctx = canvas.getContext('2d');
const db = firebase.database();
const game = {

    data : {

        mode : 'solo',
        currentScreen : 'initial',
    
        player : {},
        computerBots : [],
        pipes : [],
        reachableObjects : [],
        
        score : 0,
        lives : 0,
        xAcceleration : (0.00000125 * canvas.width), //0.001 in 800px canvas width
        xMaxSpeed : (0.00875 * canvas.width), //7 in 800px canvas width
        xSpeed : (0.0025 * canvas.width), //2 in 800px canvas width
    
        distanceBetweenPairs : (canvas.width / 2),
    
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
    
        this.data.player = new Pixel();
        this.data.player.jump();
    
        if (this.data.mode == 'vs computer') {
    
            this.data.computerBots.push(new AI());
            this.data.computerBots.forEach( _bot => { _bot.jump() } );
            
        };
    
        this.data.pipes.push(new Pipe());
    
        gameLoop();
    
    },

    updateGameSpeed() {

        if (this.data.xSpeed + this.data.xAcceleration <= this.data.xMaxSpeed) {

            this.data.xSpeed += this.data.xAcceleration;

        } else {

            this.data.xSpeed = this.data.xMaxSpeed;

        };

    },

    updatePipes() {

        if (this.data.pipes[0].xPosition <= - this.data.pipes[0].width) {

            this.data.pipes.shift();

        };
        
        while (this.data.pipes.length < 3) {
        
            let _lastPairIndex = this.data.pipes.length - 1;
            let _xPosition = this.data.pipes[_lastPairIndex].xPosition + this.data.pipes[_lastPairIndex].width + this.data.distanceBetweenPairs;

            let _yDirection, _transparency, _size, _space;

            if (this.data.score > 5500) {

                _space = 150 + Math.random() * 50;
                _size = sortInt(3) + 3;
                _transparency = sortInt();
                _yDirection = sortInt();
                (sortInt() == 0) ? (_yDirection = _yDirection * -1) : null;
                
            } else if (this.data.score > 4000) {
                
                _space = 150 + Math.random() * 50;
                _size = sortInt(3) + 2;
                _transparency = sortInt();

            }else if (this.data.score > 2500) {

                _size = sortInt() + 2;
                _transparency = sortInt();

            } else if (this.data.score > 1000) {

                _size = sortInt() + 1;

            };
            
            this.data.pipes.push(new Pipe(_xPosition, _size, _transparency, _yDirection, _space));

        };

    },

    showPlayerLives() {

        const _heart = new ObjectHeart((0.015 * canvas.width), (0.088888889 * canvas.height), (0.0175 * canvas.width));

        for (let i = 1; i <= this.data.player.lives; i++) {

            _heart.show();

            _heart.xPosition += (0.03 * canvas.width);

        };

    },

    updateReachableObjects() {

        if (this.data.reachableObjects.length > 0 && this.data.reachableObjects[0].xPosition <= - this.data.reachableObjects[0].width) {

            this.data.reachableObjects.shift();

        };
        
        if (this.data.score % 2000 == 0) {

            let _lastPairIndex = this.data.pipes.length - 1;
            let _xPosition = this.data.pipes[_lastPairIndex].xPosition + this.data.pipes[_lastPairIndex].width + (this.data.distanceBetweenPairs / 2);

            this.data.reachableObjects.push(new ObjectHeart(_xPosition));

        };

    },

    resetGame() {

        this.data.score = 0;
        this.data.lives = 0;
        this.data.xSpeed = 2;
        this.data._fpsCount = 0;
        this.data._fpsTimeStamp = Date.now();

        this.data.player = {};
        this.data.computerBots = [];
        this.data.pipes = [];
        this.data.reachableObjects = [];

    },

    fpsCalculate() {

        if (Date.now() - this.data._fpsTimeStamp >= 5000) {

            this.data._fpsTimeStamp = Date.now();

            // document.getElementById('fps').innerText = `FPS: ${this.data._fpsCount/5}`;

            this.data._fpsCount = 0;

        } else {

            this.data._fpsCount ++

        }

    },

    updateScore() {

        this.data.score ++;
        
    },

    showScore() {

        ctx.fillStyle = 'black';    
        ctx.textAlign = "left";
        ctx.font = `${0.053333333 * canvas.height}px 'VT323'`;
        ctx.fillText(`Score: ${game.data.score}`, (0.011111111 * canvas.height), (0.044444444 * canvas.height));

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
    
    if (!game.data.player.checkHit(game.data.pipes)) {

        drawScreen.clear();

        game.updatePipes();
        game.updateReachableObjects();
        game.updateGameSpeed();
        game.fpsCalculate();
        
        if (game.data.mode == 'vs computer') {
            
            game.data.computerBots.forEach( _bot => {
                
                if (!_bot.isDead) {
                    
                    _bot.think(game.data.pipes, game.data.xSpeed);
                    _bot.move();
                    _bot.show();

                    if (_bot.checkHit(game.data.pipes)) {

                        _bot.isDead = true;
                        _bot.score = game.data.score;

                    };

                    // let _reachedObject;

                    // if (game.data.reachableObjects.length > 0) {
            
                    //     _reachedObject = _bot.checkReachedObject(game.data.reachableObjects);
            
                    // };
            
                    // if (_reachedObject) {
            
                    //     _reachedObject.reach(_bot);
            
                    // };
                    
                };
                
            });
            
        };
        
        game.data.player.move();
        game.data.player.show();

        game.data.pipes.forEach( _pipe => {
            
            _pipe.move(game.data.xSpeed);
            _pipe.show();
        
        });

        game.data.reachableObjects.forEach( _object => {

            _object.move(game.data.xSpeed);
            _object.show();

        });

        let _reachedObject;

        if (game.data.reachableObjects.length > 0) {

            _reachedObject = game.data.player.checkReachedObject(game.data.reachableObjects);

        };

        if (_reachedObject) {

            _reachedObject.reach(game.data.player);

        };

        game.showPlayerLives();
        game.updateScore();
        game.showScore();
        
        drawScreen.instructions();

        requestAnimationFrame(gameLoop);

    } else if (game.data.player.lives > 0) {
        
        game.data.player.lives --;

        if (game.data.player.yPosition + game.data.player.height >= canvas.height) {

            game.data.player.yPosition = canvas.height - game.data.player.height - 5;
            game.data.player.jump();

        } else {

            game.data.pipes.shift();
            
        };

        requestAnimationFrame(gameLoop);

    } else {

        let _aliveBotsNumber = game.data.computerBots.filter(_bot => !_bot.isDead).length;    
        drawScreen.gameOver(_aliveBotsNumber);

        if (game.data.score > game.data.lowestHighScore || game.data.highScoresDB.length < 10) {
    
            drawScreen.highScoreGameOver();
    
        };

    };

};

function sortInt(_upperLimit) {

    if (_upperLimit) {

        return Math.floor( Math.random() * _upperLimit );

    } else {

        return Math.round(Math.random());

    };

};

canvas.addEventListener('mousedown', (_event) => {

    if (_event.button == 0){

        let _x = _event.x - canvas.getBoundingClientRect().x;
        let _y = _event.y - canvas.getBoundingClientRect().y;

        if (game.data.currentScreen == 'initial') {

            if (_x >= (0.1875 * canvas.width) && _x <= (0.475 * canvas.width) && _y >= (0.39 * canvas.height) && _y <= (0.49 * canvas.height)) {
                
                drawScreen.activateButton('solo');
                game.data.mode = 'solo';
                
            } else if (_x >= (0.525 * canvas.width) && _x <= (0.8125 * canvas.width) && _y >= (0.39 * canvas.height) && _y <= (0.49 * canvas.height)) {

                drawScreen.activateButton('vs computer');
                game.data.mode = 'vs computer';
                
            } else if (_x >= (0.40375 * canvas.width) && _x <= (0.59125 * canvas.width) && _y >= (0.79 * canvas.height) && _y <= (0.89 * canvas.height)) {

                game.start();
                
            }

        } else if (game.data.currentScreen == 'game') {

            game.data.player.jump();
    
        } else if (game.data.currentScreen == 'game over') {

            if (_x >= (0.375 * canvas.width) && _x <= (0.625 * canvas.width) && _y >= (0.79 * canvas.height) && _y <= (0.89 * canvas.height)) {
                
                game.start();

            } else if (_x >= (0.75 * canvas.width) && _x <= (0.875 * canvas.width) && _y >= (0.79 * canvas.height) && _y <= (0.89 * canvas.height)) {

                drawScreen.clear();
                scoreNameInput.style.setProperty('display','none');
                drawScreen.initial();
            }

        } else if (game.data.currentScreen == 'game over - high score') {

            if (_x >= (0.375 * canvas.width) && _x <= (0.625 * canvas.width) && _y >= (0.79 * canvas.height) && _y <= (0.89 * canvas.height)) {
                
                game.start();

            }  else if (_x >= (0.75 * canvas.width) && _x <= (0.875 * canvas.width) && _y >= (0.79 * canvas.height) && _y <= (0.89 * canvas.height)) {

                drawScreen.clear();
                scoreNameInput.style.setProperty('display','none');
                drawScreen.initial();

            } else if (_x >= (0.65625 * canvas.width) && _x <= (0.84375 * canvas.width) && _y >= (0.57 * canvas.height) && _y <= (0.636 * canvas.height)) {
                
                if (scoreNameInput.value == '') {

                    drawScreen.highScoreGameOver(true);

                } else {

                    game.sendHighScore();

                };

            };

        };

    };

});