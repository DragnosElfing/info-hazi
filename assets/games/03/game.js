const CANVAS = document.getElementsByTagName('canvas')[0];

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

const CTX = CANVAS.getContext('2d');

const GRAVITY = 9.81;
class Ball{
    constructor(x, y, radius){
        this.x = x;
        this.y = y;

        this.radius = radius;
        this.dy = 0;
        this.dx = (Math.random()-.5)*10;
    }
    draw(){
        CTX.beginPath();
        CTX.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        
        CTX.lineTo(this.x, this.y+this.radius);
        CTX.lineTo(this.x-this.radius, this.y);
        CTX.lineTo(this.x+this.radius, this.y);
        
        CTX.strokeStyle = 'black';
        CTX.fillStyle = 'white';
        CTX.fill();
        CTX.stroke();
        CTX.closePath();
    }
    update(){
        this.draw();

        if(Math.sqrt((mouse.x-this.x)**2+(mouse.y-this.y)**2) < this.radius){
            if(this.x > mouse.x){
                this.dx = 2;
            }else if(this.x < mouse.x){
                this.dx = -2;
            }
            this.dy = -2;
        }
        if(this.x-this.radius <= 0 || this.x+this.radius >= CANVAS.width){
            this.dx = -this.dx;
        }
        this.dx *= 0.99;
        this.x += this.dx;

        if(this.y+this.radius+1 > CANVAS.height){
            this.y = CANVAS.height-this.radius;
            this.dy = -this.dy*0.7;
        }else{
            this.dy += 0.1;
        }
        this.y += this.dy*GRAVITY;
    }

}
class Player{
    constructor(){
        this.width = 40;
        this.height = 100;

        this.x = mouse.x ?? 0;
        this.y = CANVAS.height-this.height;
    }
    draw(){
        CTX.fillStyle = 'black';
        CTX.fillRect(this.x, this.y, this.width, this.height)
    }

    update(){
        this.draw();

        this.x = mouse.x;
    }
}

let mouse = {
    x: undefined,
    y: undefined
};
CANVAS.onmousemove = function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

let ball = new Ball(CANVAS.width/2+50, CANVAS.height/2-200, 50);
let player = new Player();
function applyGravity(){
    requestAnimationFrame(applyGravity);

    CTX.fillStyle = 'rgba(255, 255, 255, 0.7)'
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
    
    ball.update();
    player.update();
}
applyGravity();