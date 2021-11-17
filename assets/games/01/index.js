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
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    for(let circle of circles){
        circle.update();
    }

}

init();
animate();

/*let randX = Math.random()*CANVAS.width;
let randY = Math.random()*CANVAS.height;
basicAnimation(randX-this.radius<0?randX+this.radius+6:(randX+this.radius)>CANVAS.width?randX-this.radius:randX, 
                randY-this.radius<0?randY+this.radius+6:(randY+this.radius)>CANVAS.height?randY-this.radius:randY);
*/
/*let lines = [];
let INIT_X, INIT_Y;
let clicks = 1,
    objCount = 0;

let t1 = 0, t2 = 0;

CANVAS.onmousedown = (e)=>{
    if(e.buttons == 2){
        if(clicks != 1) lines[objCount] = {cancelled: true};
        else return false;
    }
    INIT_X = e.clientX;
    INIT_Y = e.clientY-50;

    if(clicks > 0){
        if(!CONTINOUS_DRAWING.checked){
            if(clicks > 1){
                INIT_X = undefined;
                INIT_Y = undefined;
    
                clicks = 0;
            }
        }else{
            clicks = 0;
        }
        objCount++;
    }
    clicks++;
}
CANVAS.onmousemove = (e)=>{
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    if(lines.length != 0){
        for(let line of lines){
            if(!line.cancelled){
                drawLine(CTX, line.x1, line.y1, line.x2, line.y2, line.color);
            }
        }
    }

    //drawLine(CTX, INIT_X, INIT_Y, e.clientX, e.clientY, 'black');
    t1 = Math.abs(INIT_X-e.clientX)/Math.sqrt(Math.abs(INIT_X-e.clientX)**2+Math.abs(INIT_Y-e.clientY)**2);
    t2 = Math.abs(INIT_Y-e.clientY)/Math.sqrt(Math.abs(INIT_X-e.clientX)**2+Math.abs(INIT_Y-e.clientY)**2);;
    console.log(t1, t2)
    lines[objCount] = {x1: INIT_X, y1: INIT_Y, 
                    x2: (t1*INIT_X + (1-t1)*e.clientX), y2: (t2*INIT_X + (1-t2)*e.clientY-50), 
                    color: 'black'};
}

CLEAR_BUTTON.onclick = (e)=>{
    e.preventDefault();
    
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    
    lines = [];
    objCount = 0;
    INIT_X = undefined;
    INIT_Y = undefined;
}

window.oncontextmenu = (e)=>{
    return false;
}

function drawLine(context, x1, y1, x2, y2, color) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}*/