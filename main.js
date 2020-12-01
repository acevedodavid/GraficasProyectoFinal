class GForm {

    constructor(v, c) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(c), gl.STATIC_DRAW);

        this.vertices = v;
        this.colors = c;
        this.numVertices = v.length / 3;
    }

    draw() {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(attribs.positionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribs.positionLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(attribs.colorLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribs.colorLocation);

        gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
    }
}

class Fish {

    constructor(centerX, centerY, centerZ, speed, direction) {
        const vertexDataBody = [
                              centerX, centerY, centerZ + 2, //body - back
                              centerX, centerY - 1, centerZ, //body - front bottom 
                              centerX, centerY + 1, centerZ, //body - front top
                              centerX, centerY - 1, centerZ, //head - back bottom
                              centerX, centerY + 1, centerZ, //head - back front
                              centerX, centerY, centerZ - 1, //head - front
                              centerX, centerY + 0.5, centerZ + 0.5, //top fin - middle body
                              centerX, centerY + 1, centerZ, //top fin - front body
                              centerX, centerY + 1.2, centerZ + 1, //top fin - out
                             ];

        const vertexDataTail = [centerX, centerY, centerZ + 2, //front
                              centerX, centerY - 0.5, centerZ + 2.5, //back bottom
                              centerX, centerY + 0.5, centerZ + 2.5]; //back top
        let colorDataBody = [];
        let colorDataTail = [];
        let faceColor = [1, 0.584, 0.078];
        for (let vertex = 0; vertex < 9; vertex++) {
            colorDataBody.push(...faceColor);
            colorDataTail.push(...faceColor);
        }

        this.vdb = [
                  centerX, centerY, centerZ + 2, //body - back
                  centerX, centerY - 1, centerZ, //body - front bottom 
                  centerX, centerY + 1, centerZ, //body - front top
                  centerX, centerY - 1, centerZ, //head - back bottom
                  centerX, centerY + 1, centerZ, //head - back front
                  centerX, centerY, centerZ - 1, //head - front
                  centerX, centerY + 0.5, centerZ + 0.5, //top fin - middle body
                  centerX, centerY + 1, centerZ, //top fin - front body
                  centerX, centerY + 1.2, centerZ + 1, //top fin - out
                 ];
        this.vdt = [centerX, centerY, centerZ + 2, //front
                    centerX, centerY - 0.5, centerZ + 2.5, //back bottom
                    centerX, centerY + 0.5, centerZ + 2.5]; //back top
        this.speed = speed;
        this.direction = direction;
        this.body = new GForm(vertexDataBody, colorDataBody);
        this.tail = new GForm(vertexDataTail, colorDataTail);
    }

    draw() {
        // No estoy seguro si hacer primero moveFish o moveTail
        //this.moveFish();
        this.moveFish();
        //this.moveTail();
        this.body.draw();
        this.tail.draw();
    }

    g(x) {
        return (2 * (Math.abs((x % 2) - 1)));
    }

    degToCos(d) {
        return Math.cos(d * Math.PI / 180);
    }

    degToSin(d) {
        return Math.sin(d * Math.PI / 180);
    }

    moveFish() {
        let w = this.speed;
        let d = this.direction;
        let cos = degToCos(w * t * d);
        let sin = degToSin(w * t * d);
        //body
        for (let triangle = 0; triangle < 9; triangle++) {
            let x = triangle * 3;
            let y = (triangle * 3) + 2;
            this.body.vertices[x] = (this.vdb[x] * cos) - (this.vdb[y] * sin);
            this.body.vertices[y] = (this.vdb[x] * sin) + (this.vdb[y] * cos);
        }
        
        //tail
        // En las primeras dos se utiliza vdt porque no se hace update 
        // a las coordenadas en moveTail()
        this.tail.vertices[0] = (this.vdt[0] * cos) - (this.vdt[2] * sin);
        this.tail.vertices[2] = (this.vdt[0] * sin) + (this.vdt[2] * cos);
        this.tail.vertices[3] = (this.vdt[3] * cos) - (this.vdt[5] * sin);
        this.tail.vertices[5] = (this.vdt[3] * sin) + (this.vdt[5] * cos);
        this.tail.vertices[6] = (this.vdt[6] * cos) - (this.vdt[8] * sin);
        this.tail.vertices[8] = (this.vdt[6] * sin) + (this.vdt[8] * cos);
    }

    moveTail() {
        let a = 30;
        let w = 0.9;
        let x = degToCos((a) * this.g(w * t)) - degToSin((a) * this.g(w * t));
        let y = degToSin((a) * this.g(w * t)) + degToCos((a) * this.g(w * t));
        //console.log(this.vertexDataTail[3]);
        this.tail.vertices[3] += x * (-2.5 * degToSin(t));
        this.tail.vertices[5] += y * (2.5 * degToCos(t));
        this.tail.vertices[6] += x * (-2.5 *degToSin(t));
        this.tail.vertices[8] += y * (2.5 * degToCos(t));
    }
}

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
const mat4 = glMatrix.mat4

if (!gl) {
    throw new Error('WebGL not supported');
}

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;
attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;
uniform mat4 matrix;
void main() {
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;
varying vec3 vColor;
void main() {
    gl_FragColor = vec4(vColor, 1);
}
`);
gl.compileShader(fragmentShader);



const vertexData1 = [
// cube
    // Front
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, -.5, 0.5,

    // Left
    -.5, 0.5, 0.5,
    -.5, -.5, 0.5,
    -.5, 0.5, -.5,
    -.5, 0.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, -.5,

    // Back
    -.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, 0.5, -.5,
    0.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, -.5, -.5,

    // Right
    0.5, 0.5, -.5,
    0.5, -.5, -.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    0.5, -.5, -.5,

    // Top
    0.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, -.5,

    // Bottom
    0.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, -.5,
];

const vertexDataOceanFloor = [
// cube
    // Bottom
    10, -1, 10,
    10, -1, -10,
    -10, -1, 10,
    -10, -1, 10,
    10, -1, -10,
    -10, -1, -10,
];
let colorDataOceanFloor = [];
for (let face = 0; face < 1; face++) {
    let faceColor = [0.940, 0.889, 0.602];
    for (let vertex = 0; vertex < 6; vertex++) {
        colorDataOceanFloor.push(...faceColor);
    }
}


let vertexDataArr = [];
vertexDataArr.push(vertexData1);
vertexDataArr.push(vertexDataOceanFloor);

function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
}

let cubeColors = [];
for (let i = 0; i < 2; i++) {
    let colorData = [];
    for (let face = 0; face < 6; face++) {
        let faceColor = randomColor();
        for (let vertex = 0; vertex < 6; vertex++) {
            colorData.push(...faceColor);
        }
    }
    cubeColors.push(colorData);
}
//console.log(gl.getShaderInfoLog(fragmentShader));

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);


const attribs = {
    positionLocation: gl.getAttribLocation(program, `position`),
    colorLocation: gl.getAttribLocation(program, `color`),
};


//------ OBJECT DECLARATION -------
let myCube = new GForm(vertexData1, cubeColors[0]);
let oceanFloor = new GForm(vertexDataOceanFloor, colorDataOceanFloor);
let fishArray = [];
for (let i = 0; i < 1; i++) {
    //(x,y,z,speed,direction)
    let fish = new Fish(randomIntFromInterval(3,10), randomIntFromInterval(1,10), 0, randomFloatFromInterval(3,10), -1);
    fishArray.push(fish);
}
//let fish = new Fish(5, 2, 0, 5, -1);
//let fish2 = new Fish(7, 3, 0, 6 ,-1);
//let fish3 = new Fish(3, 1, 0, 3, -1);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
    matrix: gl.getUniformLocation(program, `matrix`),
};

const modelMatrix = mat4.create(); //transformations to object
const viewMatrix = mat4.create(); //transformations to view
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix,
    75 * Math.PI / 180, // vertical field-of-view (angle, radians)
    canvas.width / canvas.height, // aspect W/H
    1e-4, // near cull distance
    1e4 // far cull distance
);

const mvMatrix = mat4.create(); //model-view matrix intermedidate
const mvpMatrix = mat4.create(); //model-view-projection matrix

mat4.translate(modelMatrix, modelMatrix, [-1, -1, -5]);
mat4.translate(viewMatrix, viewMatrix, [-1, -1, 0]);
mat4.invert(viewMatrix, viewMatrix);
mat4.multiply(mvMatrix, viewMatrix, modelMatrix);

// camera movement
var offsetX = 0;
var offsetZ = 0;
var x = 0.0;
var y = 0.0;
var z = 0.0;
var rotX = 0.0;
var currRotXAngle = 0;
var vel = 0.0698;
var xFrontalMovement = 0;
var zFrontalMovement = 0;
var xLateralMovement = 0;
var zLateralMovement = 0;
document.addEventListener('keydown', function (event) {
    if (event.key == 'a') {
        xLateralMovement = degToCos(currRotXAngle) * vel;
        zLateralMovement = degToSin(currRotXAngle) * vel;
    } else if (event.key == 'd') {
        xLateralMovement = degToCos(currRotXAngle + 180) * vel;
        zLateralMovement = degToSin(currRotXAngle + 180) * vel;
    } else if (event.key == 'ArrowUp') {
        y = -1 * vel;
    } else if (event.key == 'ArrowDown') {
        y = vel;
    } else if (event.key == 'w') {
        xFrontalMovement = degToCos(currRotXAngle + 90) * vel;
        zFrontalMovement = degToSin(currRotXAngle + 90) * vel;
    } else if (event.key == 's') {
        xFrontalMovement = degToCos(currRotXAngle - 90) * vel;
        zFrontalMovement = degToSin(currRotXAngle - 90) * vel;
    } else if (event.key == 'ArrowLeft') {
        rotX = -0.9;
    } else if (event.key == 'ArrowRight') {
        rotX = 0.9;
    }
    x = xFrontalMovement + xLateralMovement;
    z = zFrontalMovement + zLateralMovement;
});

document.addEventListener('keyup', function (event) {
    if (event.key == 'a' || event.key == 'd') {
        xLateralMovement = 0;
        zLateralMovement = 0;
    } else if (event.key == 'ArrowUp' || event.key == 'ArrowDown') {
        y = 0;
    } else if (event.key == 'w' || event.key == 's') {
        xFrontalMovement = 0;
        zFrontalMovement = 0;
    } else if (event.key == 'ArrowLeft') {
        rotX = 0;
    } else if (event.key == 'ArrowRight') {
        rotX = 0;
    }
    x = xFrontalMovement + xLateralMovement;
    z = zFrontalMovement + zLateralMovement;
});

var t = 0.0;

function animate() {
    requestAnimationFrame(animate);

    //mat4.translate(modelMatrix, modelMatrix, [x,y, z]);
    //mat4.translate(modelMatrix, modelMatrix, [Math.random()-0.5, Math.random()-0.5, 0]);

    mat4.translate(viewMatrix, viewMatrix, [x, y, z]);
    offsetX += x;
    offsetZ += z;

    mat4.translate(viewMatrix, viewMatrix, [-1 * offsetX, 0, -1 * offsetZ]);

    mat4.rotate(viewMatrix, viewMatrix, degToRad(rotX), [0, 1, 0]);
    currRotXAngle += rotX;

    mat4.translate(viewMatrix, viewMatrix, [offsetX, 0, offsetZ]);

    //mat4.invert(viewMatrix, viewMatrix);
    mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);

    myCube.draw();
    oceanFloor.draw();
    for(var i = 0; i < fishArray.length; i++) {
        fishArray[i].draw();
    }
    t += 0.1;
}

animate(); //starts main loop

// Auxiliary functions
function radToDeg(r) {
    return r * 180 / Math.PI;
}

function degToRad(d) {
    return d * Math.PI / 180;
}

function degToCos(d) {
    return Math.cos(d * Math.PI / 180);
}

function degToSin(d) {
    return Math.sin(d * Math.PI / 180);
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloatFromInterval(min, max) {
    return Math.random() * (max - min + 1) + min;
}