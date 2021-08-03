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
    
            }      
    
        }
    
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
        
        this._bottomPipeSafeDistance = bottomPipeSafeDistance || 47;
        this._topPipeSafeDistance = topPipeSafeDistance || 47;
        this._clicksPerSecond = clicksPerSecond || 5;
        this._lastClickTimeStamp = 0;
    
        this.isDead = false;
        this.score = 0;

    };

    think(pipesArray, xSpeed) {

        let _nextObstacleIndex, _maxHeight;
        
        if (pipesArray[0].xPosition + pipesArray[0].width - xSpeed > this.xPosition) {
            
            _nextObstacleIndex = 0;
            
        } else {
            
            _nextObstacleIndex = 1;
        
        };

        if (pipesArray[_nextObstacleIndex+1].yPosition < pipesArray[_nextObstacleIndex].yPosition) {

            _maxHeight = this._topPipeSafeDistance + 75;

        } else {

            _maxHeight = pipesArray[_nextObstacleIndex].space - this.height - this._bottomPipeSafeDistance;

        };
        
        if (this.yPosition - pipesArray[_nextObstacleIndex].yPosition >= _maxHeight) {
            
            if (Date.now() - this._lastClickTimeStamp >= 1000 / this._clicksPerSecond) {
                
                this.jump();
                                    
                this._lastClickTimeStamp = Date.now();
                
            };
            
        };

    };

};

class Pipe {

    constructor(xPosition, width, space, fillStyle, strokeStyle, yPosition) {

        this.height = canvas.height;
        this.width = width || 60;

        this.space = space || 200;
        this.xPosition = xPosition || canvas.width;
        this.yPosition = yPosition || parseInt(Math.random() * (canvas.height - this.space));

        this.fillStyle = fillStyle || '#71BF2E';
        this.strokeStyle = strokeStyle || 'black';

    };

    move(xSpeed) {

        this.xPosition -= xSpeed;

    };
    
    show() {
        
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        
        ctx.fillRect(this.xPosition, (this.yPosition - this.height), this.width, this.height);
        ctx.strokeRect(this.xPosition, (this.yPosition - this.height), this.width, this.height);
        
        ctx.fillRect(this.xPosition, (this.yPosition + this.space), this.width, this.height);
        ctx.strokeRect(this.xPosition, (this.yPosition + this.space), this.width, this.height);
        
    };
    
};