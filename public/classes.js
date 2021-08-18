class Pixel {

    constructor(xPosition, yPosition, size, fillStyle, strokeStyle) {

        this.xPosition = xPosition || 50;
        this.yPosition = yPosition || 150;
        this.width = size || 30;
        this.height = size || 30;

        this.fillStyle = fillStyle || '#ffd000';
        this.strokeStyle = strokeStyle || 'black';
    
        this.ySpeed = 0;
        this.yAcceleration = 0.25;
        this.jumpSpeed = -6.25;
        this.lives = 0;

    };

    move() {

        this.ySpeed += this.yAcceleration;
        this.yPosition += this.ySpeed;

        if (this.yPosition + this.height >= canvas.height) {
            
            this.yPosition = canvas.height - this.height;
        
        } else if (this.yPosition < 0) {

            this.yPosition = 0;

        }
        
    };

    checkHit(pipesArray) {

        if (this.yPosition + this.height >= canvas.height) {

            return true;
            
        } else if (pipesArray[0].xPosition <= this.xPosition + this.width && pipesArray[0].xPosition + pipesArray[0].width >= this.xPosition) {
    
            if (this.yPosition <= pipesArray[0].yPosition || this.yPosition + this.height >= pipesArray[0].yPosition + pipesArray[0].space){
    
                return true;
    
            };      
    
        };
    
        return false; 

    };

    checkReachedObject(objectsArray) {

        if (objectsArray[0].xPosition <= this.xPosition + this.width && objectsArray[0].xPosition + objectsArray[0].width >= this.xPosition) {
    
            if (this.yPosition <= objectsArray[0].yPosition + objectsArray[0].height && this.yPosition + this.height >= objectsArray[0].yPosition){
    
                return objectsArray[0];
    
            };
    
        };
    
        return false; 

    };

    show() {
        
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this.xPosition, this.yPosition, this.width, this.height);

        ctx.strokeStyle = this.strokeStyle;
        ctx.strokeRect(this.xPosition, this.yPosition, this.width, this.height);

    };

    jump() {

        this.ySpeed = this.jumpSpeed;

    };

};

class AI extends Pixel {

    constructor(topPipeSafeDistance, bottomPipeSafeDistance, clicksPerSecond, yPosition, fillStyle, strokeStyle, xPosition, size) {

        super(xPosition, yPosition || 250, size, fillStyle || '#00000030', strokeStyle || '#00000040');
        
        this._bottomPipeSafeDistance = bottomPipeSafeDistance || 30;
        this._topPipeSafeDistance = topPipeSafeDistance || 30;
        this._clicksPerSecond = clicksPerSecond || 5;
        this._lastClickTimeStamp = 0;
    
        this.isDead = false;
        this.score = 0;

    };

    think(pipesArray, xSpeed) {

        let _nextPipeIndex, _maxDistanceFromTopPipe, _transparencyPenalty;
        
        if (pipesArray[0].xPosition + pipesArray[0].width - xSpeed > this.xPosition) {
            
            _nextPipeIndex = 0;
            
        } else {
            
            _nextPipeIndex = 1;
        
        };

        if (pipesArray[_nextPipeIndex].transparency == 1) {

            _transparencyPenalty = Math.random() * 1.15; // 10% chance of being greater than 1

        } else {

            _transparencyPenalty = 0;

        };

        if (pipesArray[_nextPipeIndex+1].yPosition < pipesArray[_nextPipeIndex].yPosition) {

            _maxDistanceFromTopPipe = this._topPipeSafeDistance + 75 - (_transparencyPenalty * this._topPipeSafeDistance);

        } else {

            _maxDistanceFromTopPipe = pipesArray[_nextPipeIndex].space - this.height - this._bottomPipeSafeDistance + (_transparencyPenalty * this._bottomPipeSafeDistance);

        };
        
        if (this.yPosition - pipesArray[_nextPipeIndex].yPosition >= _maxDistanceFromTopPipe) {
            
            if (Date.now() - this._lastClickTimeStamp >= 1000 / this._clicksPerSecond) {
                
                this.jump();
                                    
                this._lastClickTimeStamp = Date.now();
                
            };
            
        };

    };

};

class Pipe {

    constructor(xPosition, size, transparency, yDirection, space, fillStyle, strokeStyle, yPosition) {

        this.height = canvas.height;
        this.width = size * 60 || 60;

        this.space = space || 200;
        this.xPosition = xPosition || canvas.width;
        this.yPosition = yPosition || parseInt(Math.random() * (canvas.height - this.space));

        this.yDirection = yDirection || 0;
        this.yVelocity = 1.5;
        this.transparency = transparency || 0;

        this.fillStyle = fillStyle || '#71BF2E';
        this.strokeStyle = strokeStyle || 'black';

    };

    move(xSpeed) {

        this.xPosition -= xSpeed;

        if (this.yDirection != 0) {

            let _newYPosition = this.yPosition + this.yDirection * this.yVelocity;

            if (_newYPosition < 0) {

                this.yPosition = 0;
                this.yDirection = 1;

            } else if (_newYPosition + this.space > canvas.height) {

                this.yPosition = canvas.height - this.space;
                this.yDirection = -1;

            } else {

                this.yPosition = _newYPosition;

            };

        };

    };
    
    show() {

        if (this.transparency == 0 || this.xPosition > canvas.width * 3/4) {

            ctx.strokeStyle = this.strokeStyle;
            ctx.fillStyle = this.fillStyle;

        } else {
            
            ctx.strokeStyle = '#00000020';
            ctx.fillStyle = '#00000008';

        }
        
        ctx.fillRect(this.xPosition, (this.yPosition - this.height), this.width, this.height);
        ctx.strokeRect(this.xPosition, (this.yPosition - this.height), this.width, this.height);
        
        ctx.fillRect(this.xPosition, (this.yPosition + this.space), this.width, this.height);
        ctx.strokeRect(this.xPosition, (this.yPosition + this.space), this.width, this.height);
        
    };
    
};

class ReachableObject {

    constructor(xCenterPosition, yCenterPosition, size) {

        this.width = size || 30;
        this.height = size || 30;

        this.xCenterPosition = xCenterPosition || 0;
        this.yCenterPosition = yCenterPosition || parseInt(Math.random() * (canvas.height * 2 / 3) + canvas.height / 6);

        this.xPosition = this.xCenterPosition - (this.width / 2);
        this.yPosition = this.yCenterPosition - (this.height / 2);

    };

    show() {

        ctx.drawImage(this.img, this.xPosition, this.yPosition, this.width, this.height);

    };

    move(xSpeed) {

        this.xPosition -= xSpeed;

    };

};

class ObjectHeart extends ReachableObject {

    constructor(xCenterPosition, yCenterPosition, size) {

        super(xCenterPosition, yCenterPosition, size);

        this.img = new Image();
        this.img.src = "./img/heart.png";

    };

    reach(subjectPixel) {

        subjectPixel.lives ++;
        game.data.reachableObjects.shift();

    };

};