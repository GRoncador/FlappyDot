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
        ctx.fillRect( (0.40375 * canvas.width), (0.79 * canvas.height), (0.1875 * canvas.width), (0.1 * canvas.height))

        ctx.strokeStyle = '#af2323'
        ctx.strokeRect(0.40375 * canvas.width, (0.79 * canvas.height), (0.1875 * canvas.width), (0.1 * canvas.height))
        
        // text 'Flappy Pixel'
        ctx.fillStyle = 'black'
        ctx.textAlign = "center";
        ctx.font = `${0.16 * canvas.height}px 'VT323'`;
        ctx.fillText("Flappy Pixel", (canvas.width / 2), (0.2 * canvas.height));

        // text 'START'
        ctx.fillStyle = 'black'
        ctx.font = `${0.08 * canvas.height}px 'VT323'`;
        ctx.fillText("START", (canvas.width / 2), (0.86 * canvas.height));

        drawScreen.activateButton(game.data.mode);

    },

    activateButton(button) {

        if (button == 'solo') {

            // yellow button - 'Play Solo'
            ctx.fillStyle = '#ffd000'    
            ctx.fillRect((0.1875 * canvas.width), (0.39 * canvas.height), (0.2875 * canvas.width), (0.1 * canvas.height))

            ctx.strokeStyle = '#b48912'
            ctx.strokeRect((0.1875 * canvas.width), (0.39 * canvas.height), (0.2875 * canvas.width), (0.1 * canvas.height))

            // grey button - 'Vs Computer'
            ctx.fillStyle = '#c7c7c7'
            ctx.fillRect((0.525 * canvas.width), (0.39 * canvas.height), (0.2875 * canvas.width), (0.1 * canvas.height))

            ctx.strokeStyle = '#313131'
            ctx.strokeRect((0.525 * canvas.width), (0.39 * canvas.height), (0.2875 * canvas.width), (0.1 * canvas.height))

            // text 'Vs Computer'
            ctx.font = `${0.08 * canvas.height}px 'VT323'`;
            ctx.fillStyle = '#8d8d8d'
            ctx.fillText("Vs Computer", (canvas.width * 2 / 3), (0.46 * canvas.height));
                
            // text 'Solo'
            ctx.font = `${0.08 * canvas.height}px 'VT323'`;
            ctx.fillStyle = 'black'
            ctx.fillText("Solo", (canvas.width / 3), (0.46 * canvas.height));
    
        } else if (button == 'vs computer') {

            // grey button - 'Play Solo'
            ctx.fillStyle = '#c7c7c7'
            ctx.fillRect((0.1875 * canvas.width), (0.39 * canvas.height), (0.2875 * canvas.width), (0.1 * canvas.height))
            
            ctx.strokeStyle = '#313131'
            ctx.strokeRect((0.1875 * canvas.width), (0.39 * canvas.height), (0.2875 * canvas.width), (0.1 * canvas.height))
            
            // yellow button - 'Vs Computer'
            ctx.fillStyle = '#ffd000'    
            ctx.fillRect((0.525 * canvas.width), (0.39 * canvas.height), (0.2875 * canvas.width), (0.1 * canvas.height))
        
            ctx.strokeStyle = '#b48912'
            ctx.strokeRect((0.525 * canvas.width), (0.39 * canvas.height), (0.2875 * canvas.width), (0.1 * canvas.height))

            // text 'Vs Computer'
            ctx.font = `${0.08 * canvas.height}px 'VT323'`;
            ctx.fillStyle = 'black'
            ctx.fillText("Vs Computer", (canvas.width * 2 / 3), (0.46 * canvas.height));
            
            // text 'Solo'
            ctx.font = `${0.08 * canvas.height}px 'VT323'`;
            ctx.fillStyle = '#8d8d8d'
            ctx.fillText("Solo", (canvas.width / 3), (0.46 * canvas.height));

        }

    },

    instructions() {

        if (game.data.currentScreen == 'game' && game.data.score <= 100) {

            ctx.textAlign = "center";
            ctx.fillStyle = 'black'
            ctx.font = `${0.1* canvas.height}px 'VT323'`;
            ctx.fillText("1 - Click to jump 🖱️ ⇡", (canvas.width / 2), (canvas.height / 2));

        } else if (game.data.currentScreen == 'game' && game.data.score <= 300) {

            ctx.textAlign = "center";
            ctx.fillStyle = 'black'
            ctx.font = `${0.1* canvas.height}px 'VT323'`;
            ctx.fillText("2 - Avoid the ground and obstacles", (canvas.width / 2), (canvas.height / 2));

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
        ctx.font = `${0.2* canvas.height}px 'VT323'`;
        ctx.fillText(text, (canvas.width / 2), (0.2 * canvas.height));

        // text 'your score........XXX'
        ctx.fillStyle = 'black';    
        ctx.textAlign = "center";
        ctx.font = `${0.08 * canvas.height}px 'VT323'`;
        ctx.fillText(`Your score is ......... ${game.data.score}`, (canvas.width / 2), (0.34 * canvas.height));

        // red button - 'PLAY AGAIN'
        ctx.fillStyle = '#ff6161'
        ctx.fillRect((0.375 * canvas.width), (0.79 * canvas.height), (0.25 * canvas.width), (0.1 * canvas.height))

        ctx.strokeStyle = '#af2323'
        ctx.strokeRect((0.375 * canvas.width), (0.79 * canvas.height), (0.25 * canvas.width), (0.1 * canvas.height))

        // text 'PLAY AGAIN'
        ctx.fillStyle = 'black'
        ctx.fillText("PLAY AGAIN", (canvas.width / 2), (0.86 * canvas.height));

        // grey button - 'MENU'
        ctx.fillStyle = '#9a9a9a'
        ctx.fillRect((0.75 * canvas.width), (0.79 * canvas.height), (0.125 * canvas.width), (0.1 * canvas.height))

        ctx.strokeStyle = 'black'
        ctx.strokeRect((0.75 * canvas.width), (0.79 * canvas.height), (0.125 * canvas.width), (0.1 * canvas.height))

        // text 'MENU'
        ctx.fillStyle = 'black'
        ctx.fillText("MENU", (0.8125 * canvas.width), (0.86 * canvas.height));

    },

    highScoreGameOver(highlight_Name_Instruction) {

        game.data.currentScreen = 'game over - high score';

        // yellow box
        ctx.fillStyle = '#ffd000';
        ctx.fillRect((0.125 * canvas.width), (0.41 * canvas.height), (0.75 * canvas.width), (0.3 * canvas.height));

        ctx.strokeStyle = 'black';
        ctx.strokeRect((0.125 * canvas.width), (0.41 * canvas.height), (0.75 * canvas.width), (0.3 * canvas.height));

        // text 'New High Score!'
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = `${0.08 * canvas.height}px 'VT323'`;
        ctx.fillText("New High Score!", (canvas.width / 2), (0.49 * canvas.height));

        if (highlight_Name_Instruction) {

            // HIGHLIGHT text 'Enter your name:'
            ctx.textAlign = "center";
            ctx.fillStyle = 'red';    
            ctx.font = `bold ${0.05 * canvas.height}px 'VT323'`;
            ctx.fillText('Enter your name:', (0.24375 * canvas.width), (0.614 * canvas.height));

        } else {

            // text 'Enter your name:'
            ctx.fillStyle = 'black'    
            ctx.font = `${0.05 * canvas.height}px 'VT323'`;
            ctx.fillText('Enter your name:', (0.24375 * canvas.width), (0.614 * canvas.height));

        };

        // grey button 'Send Score'
        ctx.fillStyle = '#9a9a9a'
        ctx.fillRect((0.65625 * canvas.width), (0.57 * canvas.height), (0.1875 * canvas.width), (0.066 * canvas.height))

        ctx.strokeStyle = 'black'
        ctx.strokeRect((0.65625 * canvas.width), (0.57 * canvas.height), (0.1875 * canvas.width), (0.066 * canvas.height))

        // text 'Send Score'
        ctx.textAlign = "left";
        ctx.fillStyle = 'black'    
        ctx.font = `${0.05 * canvas.height}px 'VT323'`;
        ctx.fillText('Send Score', (0.6875 * canvas.width), (0.614 * canvas.height));

        // name input
        document.getElementById('score-name-input').style.setProperty('display','block');
   
    },

    highScoreSent() {

        game.data.currentScreen = 'game over'
        
        // yellow box
        ctx.fillStyle = '#ffd000'    
        ctx.fillRect((0.125 * canvas.width), (0.41 * canvas.height), (0.75 * canvas.width), (0.3 * canvas.height))

        ctx.strokeStyle = 'black'    
        ctx.strokeRect((0.125 * canvas.width), (0.41 * canvas.height), (0.75 * canvas.width), (0.3 * canvas.height))

        // text 'New High Score!'
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = `${0.08 * canvas.height}px 'VT323'`;
        ctx.fillText("New High Score!", (canvas.width / 2), (0.49 * canvas.height));

        // text 'Welcome to the Hall of Fame :)'
        ctx.fillStyle = 'black'
        ctx.textAlign = "center";    
        ctx.font = `${0.05 * canvas.height}px 'VT323'`;
        ctx.fillText('Welcome to the Hall of Fame :)', (canvas.width / 2), (0.614 * canvas.height));

        document.getElementById('score-name-input').style.setProperty('display','none');

    },

};