const canvas = document.getElementById("theCanvas");
const ctx = canvas.getContext("2d");
ctx.scale(canvas.width * 0.9 / 2, canvas.height * 0.9 / 2)
ctx.translate(1,1);

const constants = {
    PRECISION: 0.001,
    ANGLE_INTERVAL: 2*3.14/360,
}

class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

let taxicab = (point) => Math.abs(point.x) + Math.abs(point.y);
let euclideanx = (dim, point) => Math.sqrt(Math.abs(Math.pow(point.x,dim)) + Math.abs(Math.pow(point.y, dim)));
let hyperbolic = (point) => Math.log( (1 + euclideanx(2, point)) / (1 - euclideanx(2,point)));

let pointOnAngle = (angle, l) => new Point(Math.cos(angle)*l, Math.sin(angle) * l);

let findByDichotomy = (angle, distance) => {
    let lower = 0;
    let upper = 2;
    let l = upper;
    let p =pointOnAngle(angle,l);
    let d = distance(p);
    let count = 0;
    while(Math.abs(1 - d) > constants.PRECISION && count < 10 ) {
        //compare half to 1
        //if lower, lower upper bound
        //if greater, raise lower bound
        l = (upper + lower) / 2;
        p = pointOnAngle(angle,l);
        d = distance(p);
        if(d > 1) {
            upper = l;
        }
        else if(d < 1) {
            lower = l;
        }
        count++;
    }
    return pointOnAngle(angle,l);
}
function* angleGenerator() {
    for (let index = 0; index < 2*3.14; index+= constants.ANGLE_INTERVAL) {
        yield index;
    }
}
let angles = Array.from(angleGenerator());

let drawFigure = () => {
    ctx.clearRect(0,0,1,1);
    let points = angles.map(x => findByDichotomy(x, hyperbolic));
    points.forEach(x => {
        ctx.fillRect(x.x, x.y, 0.01,0.01);
    })
}

drawFigure();
