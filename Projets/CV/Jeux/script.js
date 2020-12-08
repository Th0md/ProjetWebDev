window.onload = function() {
    var canvas;
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 200;
    var snakee;
    var appee;
    var widthInBlock = canvasWidth/blockSize;
    var heightInBlock = canvasHeight/blockSize;
    var score;
    var timeOut;
    
    init();
    
    function init() {
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid grey";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "ddd";
        document.body.appendChild(canvas); //permet d'acrocher un tag à notre page
        ctx = canvas.getContext('2d');
        snakee = new Snake([[0,4],[-1,4],[-2,4],[-3,4]], "right");
        appee = new Apple([getRandomInt(widthInBlock-1),         getRandomInt(heightInBlock-1)]);
        score = 0;
        refreshCanvas();
    }
    
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    
    function refreshCanvas() {
        snakee.advence();
        if(snakee.checkCollision()) {
                gameOver();
            }
        else {
                if(snakee.isEatingApple(appee)) {
                        score++;
                        snakee.eatApple = true;
                        do {
                                appee.setNewPosition();
                            }
                        while(appee.isOnSnake(snakee))
                    }
                ctx.clearRect(0,0,canvasWidth,canvasHeight);
                drawScore();
                snakee.draw();
                appee.draw();
                timeOut = setTimeout(refreshCanvas,delay);
            }
    }
    
    function restart() {
            snakee = new Snake([[0,4],[-1,4],[-2,4],[-3,4]], "right");
            appee = new Apple([getRandomInt(widthInBlock-1),         getRandomInt(heightInBlock-1)]);
            score = 0;
            clearTimeout(timeOut);
            refreshCanvas();
        }
        
    function drawScore() {
            ctx.save();
            ctx.font = "bold 200px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "grey";
            ctx.fillText(score.toString(), canvasWidth/2, canvasHeight/2);
            ctx.restore();
        }
    
        
    function gameOver() {
            ctx.save();
            
            ctx.textAlign = "center";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 5;
            ctx.fillStyle = "grey";
            
            ctx.font = "bold 100px sans-serif";
            ctx.strokeText("GAME OVER",canvasWidth/2+2,canvasHeight/4+2);
            ctx.fillText("GAME OVER",canvasWidth/2,canvasHeight/4);
            
            ctx.font = "bold 50px sans-serif";
            ctx.strokeText("Faire ESPACE pour REJOUER", canvasWidth/2+2, canvasHeight/2+152);
            ctx.fillText("Faire ESPACE pour REJOUER", canvasWidth/2, canvasHeight/2+150);
            
            ctx.font = "bold 50px sans-serif";
            ctx.strokeText("Tu as mangé "+score+" pommes", canvasWidth/2+2, canvasHeight/2+252);
            ctx.fillText("Tu as mangé "+score+" pommes", canvasWidth/2, canvasHeight/2+250);
            ctx.restore();
        }
        
    function drawBlock(ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }
    
    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.eatApple = false;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i=0; i<this.body.length; i++)
                {
                    drawBlock(ctx,this.body[i])
                }
            ctx.restore();
                
                
        };
        this.advence = function() {
            var nextPosition = this.body[0].slice();
            switch(this.direction) {
                    case "left":
                        nextPosition[0]--;
                        break;
                    case "right":
                        nextPosition[0]++;
                        break;
                    case "down":
                        nextPosition[1]++;
                        break;
                    case "up":
                        nextPosition[1]--;
                        break;
                    default:
                        throw("Invalide Direction");
                }
            //
            this.body.unshift(nextPosition);
            if(!this.eatApple) {
                    this.body.pop();
                }
            else {
                    this.eatApple = false;
                }
        };
        this.setDirection = function(newDirection) {
            var allowedDirections;
            switch(this.direction) {
                    case "left":
                    case "right":
                        allowedDirections = ["up","down"];
                        break;
                    case "down":
                    case "up":
                        allowedDirections = ["left","right"];
                        break;
                    default:
                        throw("Invalide Direction");
                }
                if(allowedDirections.indexOf(newDirection) > -1) {
                    this.direction = newDirection;
                }
        };
        this.checkCollision = function() {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var tail = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlock - 1;
            var maxY = heightInBlock - 1;
            var outOfHorizonWalls = snakeX < minX || snakeX > maxX;
            var outOfVerticalWalls = snakeY < minY || snakeY > maxY;
            
            if(outOfHorizonWalls || outOfVerticalWalls) {
                    wallCollision = true;
                    //var m = alert("Boum !!");
                }
            
            for(var i = 0; i < tail.length; i++)
                if(snakeX === tail[i][0] && snakeY === tail[i][1]) {
                        snakeCollision = true;
                        //var m = alert("Aie !!");
                    }
            return wallCollision || snakeCollision;
        };
        this.isEatingApple = function(appleToEat) {
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
                    return true;
                }
            else {
                    return false;
                }
        }
    }
    
    function Apple(position) {
        this.position = position;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function() {
            var newX = getRandomInt(widthInBlock-1);
            var newY = getRandomInt(heightInBlock-1);
            this.position = [newX,newY];
        };
        this.isOnSnake = function(snakeToCheck) {
            var isOnSnake = false;
            for(var i = 0; i < snakeToCheck.body.length; i++) {
                    if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                            isOnSnake = true;
                        }
                }
            return isOnSnake;
        };
    }
    
    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode;
        var newDirection;
        switch(key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
                break;
            default:
                return;
            
        }
        snakee.setDirection(newDirection);
    }
    
}