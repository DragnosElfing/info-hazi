const CANVAS = document.getElementsByTagName('canvas')[0];

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

const CTX = CANVAS.getContext('2d');

const GRAVITY = 9.81;
class Circle{
    constructor(x, y, radius){
        this.x = x;
        this.y = y;

        this.radius = radius;
        this.dy = 0;
        this.dx = (Math.random()-.5)*10;
        this.color = ['#00949E', '#19F0FF', '#00DCEB', '#9E4000', '#EB5F00'][Math.floor(Math.random()*5)];
    }
    draw(){
        CTX.beginPath();
        CTX.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        CTX.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        CTX.fillStyle = this.color;
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

let mouse = {
    x: undefined,
    y: undefined
};
CANVAS.onmousemove = function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

let circles = [];
for(let _=0;_<=100;_++){
    let randX = Math.random()*CANVAS.width,
        randY = Math.random()*CANVAS.height-400;
    let radius = (Math.random()*35)+30;

    circles.push(new Circle(randX-radius<0?randX+radius:(randX+radius)>CANVAS.width?randX-radius:randX,
                        randY-radius<0?randY+radius:(randY+radius)>CANVAS.height?randY-radius:randY, 
                        radius)); // no.
}

function applyGravity(){
    requestAnimationFrame(applyGravity);
    
    CTX.fillStyle = 'rgba(180, 100, 150, 0.4)';
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);

    for(let circle of circles){
        circle.update();
    }
}
applyGravity();