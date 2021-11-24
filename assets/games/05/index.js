const CANVAS = document.getElementsByTagName('canvas')[0],
        CTX = CANVAS.getContext('2d');

let swidth = CANVAS.width = window.innerWidth,
    sheight = CANVAS.height = window.innerHeight;


class Vector2d{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    normalize(){
        let magnitude = Math.hypot(this.x, this.y);
        this.x /= magnitude;
        this.y /= magnitude;

        return this;
    }

    static add(v1, v2){
        return new this(v1.x+v2.x, v1.y+v2.y);
    }

    static sub(v1, v2){
        return this.add(v1, new this(-v2.x, -v2.y));
    }

    static normal(v){
        return new this(-v.y, v.x);
    }

    static dot(v1, v2){
        return (v1.x*v2.x+v1.y*v2.y);
    }
}

function DIAGS_CollisionResolve(sh1, sh2){
    let p1 = sh1;
    let p2 = sh2;

    for(let shape=0; shape < 2; shape++){
        if(shape == 1){
            p1 = sh2;
            p2 = sh1;
        }

        for(let v=0; v < p1.globalVertices.length; v++){
            let line_r1s = new Vector2d(p1.x, p1.y);
            let line_r1e = p1.globalVertices[v];

            let displacement = new Vector2d(0, 0);

            for(let w=0; w < p2.globalVertices.length; w++){
                let line_r2s = p2.globalVertices[w];
                let line_r2e = p2.globalVertices[(w+1)%p2.globalVertices.length];

                let h = (line_r2e.x - line_r2s.x) * (line_r1s.y - line_r1e.y) - (line_r1s.x - line_r1e.x) * (line_r2e.y - line_r2s.y);
				let t1 = ((line_r2s.y - line_r2e.y) * (line_r1s.x - line_r2s.x) + (line_r2e.x - line_r2s.x) * (line_r1s.y - line_r2s.y)) / h;
				let t2 = ((line_r1s.y - line_r1e.y) * (line_r1s.x - line_r2s.x) + (line_r1e.x - line_r1s.x) * (line_r1s.y - line_r2s.y)) / h;

                if (t1 >= 0 && t1 < 1 && t2 >= 0 && t2 < 1){
                    displacement = Vector2d.add(displacement,
                       new Vector2d((1 - t1)*(line_r1e.x - line_r1s.x), (1 - t1)*(line_r1e.y - line_r1s.y)));
				}
            }

            let d = new Vector2d(displacement.x * (shape == 0 ? -1 : 1),
                    displacement.y * (shape == 0 ? -1 : 1))//.normalize();
            sh1.x += d.x;
            sh1.y += d.y;
        }
    }
    return false;
}

class RectObject{
    constructor(x, y, width, height, rotation=0){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;

        this._color = 'grey';

        this.vertices = [
            new Vector2d(-this.width/2, -this.height/2),
            new Vector2d(-this.width/2, this.height/2),
            new Vector2d(this.width/2, this.height/2),
            new Vector2d(this.width/2, -this.height/2)
        ];

        this.globalVertices = this.vertices;
    }

    draw(){
        CTX.beginPath();

        CTX.strokeStyle = this.color
        for(let v=0; v < this.vertices.length; v++){
            CTX.moveTo(this.globalVertices[v].x, this.globalVertices[v].y);
            CTX.lineTo(this.globalVertices[(v+1)%this.vertices.length].x, this.globalVertices[(v+1)%this.vertices.length].y);
        }
        CTX.stroke();
        
        CTX.closePath();
    }

    update(){
        this.calculateGlobalPosition();
        this.draw();
    }

    rotate(angle){
        this.rotation = angle;
    }

    calculateGlobalPosition(){
        this.globalVertices = this.vertices.map(v=>{
            return new Vector2d(
                v.x*Math.cos(this.rotation)-(v.y*Math.sin(this.rotation))+this.x, 
                v.y*Math.cos(this.rotation)+(v.x*Math.sin(this.rotation))+this.y
            );
        });
    }

    get color(){
        return this._color;
    }

    set color(value){
        this._color = value;
    }
}

class Player extends RectObject{
    constructor(x, y, width, height, rotation=0){
        super(x, y, width, height, rotation);
        
        this.dx = 0;
        this.dy = 0;
        this.speed = 4;

        this._color = 'white';

        this.collides = false;
    }

    draw(){
        CTX.beginPath();

        CTX.lineWidth = 1;
        CTX.strokeStyle = this.color;
        for(let v=0; v < this.vertices.length; v++){
            CTX.moveTo(this.globalVertices[v].x, this.globalVertices[v].y);
            CTX.lineTo(this.globalVertices[(v+1)%this.vertices.length].x, this.globalVertices[(v+1)%this.vertices.length].y);
        }
        CTX.stroke();

        CTX.closePath();
    }

    update(){
        this.calculateGlobalPosition();

        if(this.collides){
            this.color = 'red';
        }else{
            this.color = 'white';
        }

        // movement
        if(Controller.mouse.x){
            this.rotate(Math.atan2(Controller.mouse.y-player.y, Controller.mouse.x-player.x));
        }

        if(Controller.keysHeldDown[Controller.keys.FORWARD]){
            this.dy = Math.sin(this.rotation)*this.speed;
            this.dx = Math.cos(this.rotation)*this.speed;
        }
        if(Controller.keysHeldDown[Controller.keys.BACKWARD]){
            this.dy = Math.sin(this.rotation)*this.speed*.6;
            this.dx = Math.cos(this.rotation)*this.speed*.6;
        }

        // check for collisions
        this.collides = false;
        for(let o of GAME_OBJECTS){
            if(o !== this){
                this.collides |= DIAGS_CollisionResolve(this, o);
                //this.collides |= SAT_CollisionResolve(this, o);
            }
        }
        
        if(this.distanceFromMouse < -this.width/2 || this.distanceFromMouse > this.width/2 ||
            this.distanceFromMouse < -this.height/2 || this.distanceFromMouse > this.height/2){
            if(Controller.keysHeldDown[Controller.keys.FORWARD]){
                this.y += this.dy;
                this.x += this.dx;
            }
        }
        if(!(this.y-this.dy < 0+this.height/2 || this.y-this.dy > sheight-this.height/2 ||
            this.x-this.dx < 0+this.width/2 || this.x-this.dx > swidth-this.width/2)){
            if(Controller.keysHeldDown[Controller.keys.BACKWARD]){
                this.y -= this.dy;
                this.x -= this.dx;
            }
        }

        this.draw();

        this.dx = 0;
        this.dy = 0;
    }

    get distanceFromMouse(){
        return Math.hypot(this.x-Controller.mouse.x, this.y-Controller.mouse.y);
    }
}

let player = new Player(300, 300, 150, 150);
player.color = 'white';
let rects = [
    new RectObject(100, 200, 400, 70, Math.PI/2),
    new RectObject(900, 450, 400, 70)
];
const GAME_OBJECTS = [...rects, player];

let a;
function main(dt){
    a = requestAnimationFrame(main);
    //if(dt > 1000) cancelAnimationFrame(a)

    CTX.fillStyle = 'black';
    CTX.fillRect(0, 0, swidth, sheight);

    for(let o of GAME_OBJECTS){
        o.update();
    }
}

window.onload = ()=>{
    main();
}