const CANVAS = document.getElementsByTagName('canvas')[0];

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

const CTX = CANVAS.getContext('2d');

window.onresize = (e)=>{
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    init();
}

class Circle{
    constructor(x, y, dx, dy, radius){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;

        this.defRadius = this.radius;
        this.color = ['#6B4B00', '#EEBC47', '#EBA400', '#70603A', '#B88100'][Math.floor(Math.random()*5)];
    }
    draw(){
        if(Math.sqrt((this.x-mouse.x)**2+(this.y-mouse.y)**2)<200){
            this.radius = this.defRadius*(200-Math.sqrt((this.x-mouse.x)**2+(this.y-mouse.y)**2))/24;
            if(this.radius < this.defRadius){
                this.radius = this.defRadius;
            }
        }else{
            this.radius = this.defRadius;
        }

        CTX.beginPath();
        CTX.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        CTX.fillStyle = this.color;
        CTX.fill();
        CTX.closePath();
    }
    update(){
        if(this.x+this.radius > CANVAS.width || this.x-this.radius < 0){
            this.dx = -this.dx;
        }
        if(this.y+this.radius > CANVAS.height || this.y-this.radius < 0){
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

CANVAS.onmousemove = function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

let circles = [];
let mouse = {
    x: undefined,
    y: undefined
};

function init(){
    circles = [];
    for(let _=0;_<=CANVAS.width*CANVAS.height/1500;_++){
        let randX = Math.random()*CANVAS.width,
            randY = Math.random()*CANVAS.height;
        let radius = (Math.random()+1)*5;
    
        circles.push(new Circle(randX-radius<0?randX+radius:(randX+radius)>CANVAS.width?randX-radius:randX,
                                randY-radius<0?randY+radius:(randY+radius)>CANVAS.height?randY-radius:randY, 
                                4*(Math.random()-.5), 4*(Math.random()-.5), radius));
    }
}

function animate(){
    requestAnimationFrame(animate);
    CTX.fillStyle = "black";
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);

    for(let circle of circles){
        circle.update();
    }

}

init();
animate();