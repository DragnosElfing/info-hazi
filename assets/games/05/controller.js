class Controller{
    static _mouse = {
        x: null,
        y: null
    }
    static _keys = Object.freeze({
        FORWARD: 'w',
        BACKWARD: 's'
    })
    static keysHeldDown = {}

    static get keys(){
        return this._keys
    }

    static get mouse(){
        return this._mouse
    }
    static set mouse(value){
        this._mouse = {
            x: value.x,
            y: value.y
        }
    }
}

document.onmousemove = e=>{
    Controller.mouse = {
        x: e.pageX,
        y: e.pageY
    }
}

document.onkeydown = e=>{
    Controller.keysHeldDown[e.key] = true
}
document.onkeyup = e=>{
    if(Controller.keysHeldDown[e.key]) Controller.keysHeldDown[e.key] = false
}