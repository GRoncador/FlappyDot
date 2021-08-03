const drawScreen = {

    clear() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

    },

    initial() {

        game.data.currentScreen = 'initial'

        // white background
        ctx.fillStyle = '#ffffffb5'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // red button - 'START'
        ctx.fillStyle = '#ff6161'
        ctx.fillRect(323, 395, 150, 50)

        ctx.strokeStyle = '#af2323'
        ctx.strokeRect(323, 395, 150, 50)
        
        // text 'Flappy Pixel'
        ctx.fillStyle = 'black'
        ctx.textAlign = "center";
        ctx.font = "80px 'VT323'";
        ctx.fillText("Flappy Pixel", canvas.width/2, 100);

        // text 'START'
        ctx.fillStyle = 'black'
        ctx.font = "40px 'VT323'";
        ctx.fillText("START", canvas.width/2, 430);

        drawScreen.activateButton(game.data.mode);

    },

    activateButton(button) {

        if (button == 'solo') {

            // yellow button - 'Play Solo'
            ctx.fillStyle = '#ffd000'    
            ctx.fillRect(150, 195, 230, 50)

            ctx.strokeStyle = '#b48912'
            ctx.strokeRect(150, 195, 230, 50)

            // grey button - 'Vs Computer'
            ctx.fillStyle = '#c7c7c7'
            ctx.fillRect(420,195, 230, 50)

            ctx.strokeStyle = '#313131'
            ctx.strokeRect(420, 195, 230, 50)

            // text 'Vs Computer'
            ctx.font = "40px 'VT323'";
            ctx.fillStyle = '#8d8d8d'
            ctx.fillText("Vs Computer", canvas.width*2/3, 230);
                
            // text 'Solo'
            ctx.font = "40px 'VT323'";
            ctx.fillStyle = 'black'
            ctx.fillText("Solo", canvas.width/3, 230);
    
        } else if (button == 'vs computer') {

            // grey button - 'Play Solo'
            ctx.fillStyle = '#c7c7c7'
            ctx.fillRect(150, 195, 230, 50)
            
            ctx.strokeStyle = '#313131'
            ctx.strokeRect(150, 195, 230, 50)
            
            // yellow button - 'Vs Computer'
            ctx.fillStyle = '#ffd000'    
            ctx.fillRect(420,195, 230, 50)
        
            ctx.strokeStyle = '#b48912'
            ctx.strokeRect(420, 195, 230, 50)

            // text 'Vs Computer'
            ctx.font = "40px 'VT323'";
            ctx.fillStyle = 'black'
            ctx.fillText("Vs Computer", canvas.width*2/3, 230);
            
            // text 'Solo'
            ctx.font = "40px 'VT323'";
            ctx.fillStyle = '#8d8d8d'
            ctx.fillText("Solo", canvas.width/3, 230);

        }

    },

    instructions() {

        if (game.data.currentScreen == 'game' && game.data.score <= 100) {

            ctx.textAlign = "center";
            ctx.fillStyle = 'black'
            ctx.font = "50px 'VT323'";
            ctx.fillText("1 - Click to jump 🖱️ ⇡", canvas.width/2, canvas.height/2);

        } else if (game.data.currentScreen == 'game' && game.data.score <= 300) {

            ctx.textAlign = "center";
            ctx.fillStyle = 'black'
            ctx.font = "50px 'VT323'";
            ctx.fillText("2 - Avoid the ground and obstacles", canvas.width/2, canvas.height/2);

        }
    },

    gameOver(aliveBotsNumber) {

        game.data.currentScreen = 'game over'

        var text = '';

        if (game.data.mode == 'solo') {

            text = 'GAME OVER';

        } else if (game.data.mode == 'vs computer' && aliveBotsNumber == 0) {

            text = 'YOU WIN';

        } else if (game.data.mode == 'vs computer' && aliveBotsNumber > 0) {

            text = 'YOU LOSE';

        };

        // white background
        ctx.fillStyle = '#ffffffb5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // text 'GAME OVER' or 'YOU WIN' or 'YOU LOSE'  
        ctx.fillStyle = 'black';    
        ctx.textAlign = "center";
        ctx.font = "100px 'VT323'";
        ctx.fillText(text, canvas.width/2, 100);

        // text 'your score........XXX'
        ctx.fillStyle = 'black';    
        ctx.textAlign = "center";
        ctx.font = "40px 'VT323'";
        ctx.fillText(`Your score is ......... ${game.data.score}`, canvas.width/2, 170);

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

    highScoreGameOver(highlight_Name_Instruction) {

        game.data.currentScreen = 'game over - high score';

        // yellow box
        ctx.fillStyle = '#ffd000';
        ctx.fillRect(100, 205, 600, 150);

        ctx.strokeStyle = 'black';
        ctx.strokeRect(100, 205, 600, 150);

        // text 'New High Score!'
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "40px 'VT323'";
        ctx.fillText("New High Score!", canvas.width/2, 245);

        if (highlight_Name_Instruction) {

            // HIGHLIGHT text 'Enter your name:'
            ctx.textAlign = "center";
            ctx.fillStyle = 'red';    
            ctx.font = "bold 25px 'VT323'";
            ctx.fillText('Enter your name:', 195, 307);

        } else {

            // text 'Enter your name:'
            ctx.fillStyle = 'black'    
            ctx.font = "25px 'VT323'";
            ctx.fillText('Enter your name:', 195, 307);

        };

        // grey button 'Send Score'
        ctx.fillStyle = '#9a9a9a'
        ctx.fillRect(525, 285, 150, 33)

        ctx.strokeStyle = 'black'
        ctx.strokeRect(525, 285, 150, 33)

        // text 'Send Score'
        ctx.textAlign = "left";
        ctx.fillStyle = 'black'    
        ctx.font = "25px 'VT323'";
        ctx.fillText('Send Score', 550, 307);

        // name input
        document.getElementById('score-name-input').style.setProperty('display','block');
   
    },

    highScoreSent() {

        game.data.currentScreen = 'game over'
        
        // yellow box
        ctx.fillStyle = '#ffd000'    
        ctx.fillRect(100, 205, 600, 150)

        ctx.strokeStyle = 'black'    
        ctx.strokeRect(100, 205, 600, 150)

        // text 'New High Score!'
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "40px 'VT323'";
        ctx.fillText("New High Score!", canvas.width/2, 245);

        // text 'Welcome to the Hall of Fame :)'
        ctx.fillStyle = 'black'
        ctx.textAlign = "center";    
        ctx.font = "25px 'VT323'";
        ctx.fillText('Welcome to the Hall of Fame :)', canvas.width/2, 307);

        document.getElementById('score-name-input').style.setProperty('display','none');

    },

};