class GForm {

    constructor(v, c, u, n) {
        //position
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
        /*
        //color
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(c), gl.STATIC_DRAW);
        */
        //texture
        this.uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(u), gl.STATIC_DRAW);
        
        //normal for light
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(n), gl.STATIC_DRAW);

        this.vertices = v;
        this.colors = c;
        this.normalData = n;
        this.numVertices = v.length / 3;
    }

    draw() {
        //position
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(attribs.positionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribs.positionLocation);

        //color
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(attribs.colorLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribs.colorLocation);

        //normal
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalData), gl.STATIC_DRAW);
        gl.vertexAttribPointer(attribs.normalLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribs.normalLocation);
        
        gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
    }
}

class Fish {

    constructor(centerX, centerY, centerZ, speed, direction, normal) {
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
        const normalDataBody = [normal,0,0,
                                normal,0,0,
                                normal,0,0,
                                normal,0,0,
                                normal,0,0,
                                normal,0,0,
                                normal,0,0,
                                normal,0,0,
                                normal,0,0];
        const vertexDataTail = [centerX, centerY, centerZ + 2, //front
                                centerX, centerY - 0.5, centerZ + 2.5, //back bottom
                                centerX, centerY + 0.5, centerZ + 2.5 //back top
                               ]; 
        const normalDataTail = [normal,0,0,
                                normal,0,0,
                                normal,0,0];
        let colorDataBody = [];
        let colorDataTail = [];
        let faceColor = [1, 0.584, 0.078];
        for (let vertex = 0; vertex < 18; vertex++) {
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
        this.ndb = [normal,0,0,
                    normal,0,0,
                    normal,0,0,
                    normal,0,0,
                    normal,0,0,
                    normal,0,0,
                    normal,0,0,
                    normal,0,0,
                    normal,0,0];
        this.vdt = [centerX, centerY, centerZ + 2, //front
                    centerX, centerY - 0.5, centerZ + 2.5, //back bottom
                    centerX, centerY + 0.5, centerZ + 2.5]; //back top
        this.ndt = [normal,0,0,
                    normal,0,0,
                    normal,0,0];
        this.speed = speed;
        this.direction = direction;
        this.body = new GForm(vertexDataBody, colorDataBody,normalDataBody);
        this.tail = new GForm(vertexDataTail, colorDataTail,normalDataTail);
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
        for (let triangle = 0; triangle < 18; triangle++) {
            let x = triangle * 3;
            let y = (triangle * 3) + 2;
            this.body.vertices[x] = (this.vdb[x] * cos) - (this.vdb[y] * sin);
            this.body.vertices[y] = (this.vdb[x] * sin) + (this.vdb[y] * cos);
            this.body.normalData[x] = (this.ndb[x] * cos);// - (this.ndb[y] * sin);
            this.body.normalData[y] = (this.ndb[x] * sin);// + (this.ndb[y] * cos);
        }
        //tail
        for (let triangle = 0; triangle < 3; triangle++) {
            let x = triangle * 3;
            let y = (triangle * 3) + 2;
            this.tail.vertices[x] = (this.vdt[x] * cos) - (this.vdt[y] * sin);
            this.tail.vertices[y] = (this.vdt[x] * sin) + (this.vdt[y] * cos);
            this.tail.normalData[x] = (this.ndt[x] * cos);// - (this.ndb[y] * sin);
            this.tail.normalData[y] = (this.ndt[x] * sin);// + (this.ndb[y] * cos);
        }
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

class Fish3D {

    constructor(centerX, centerY, centerZ, speed, direction, normal) {
        const vertexDataBody = [
                              centerX, centerY, centerZ + 2, //body - back
                              centerX, centerY - 1, centerZ, //body - front bottom 
                              centerX + 0.3, centerY, centerZ, //body - front middle
                              centerX, centerY, centerZ + 2, //body - back
                              centerX, centerY + 1, centerZ, //body - front top
                              centerX + 0.3, centerY, centerZ, //body - front middle
                              centerX, centerY - 1, centerZ, //head - back bottom
                              centerX + 0.3, centerY, centerZ, //head - back middle
                              centerX, centerY, centerZ - 1, //head - front
                              centerX, centerY, centerZ - 1, //head - front
                              centerX, centerY + 1, centerZ, //head - back top
                              centerX + 0.3, centerY, centerZ, //head - back middle
                              centerX, centerY, centerZ + 2, //body - back
                              centerX, centerY - 1, centerZ, //body - front bottom 
                              centerX - 0.3, centerY, centerZ, //body - front middle
                              centerX, centerY, centerZ + 2, //body - back
                              centerX, centerY + 1, centerZ, //body - front top
                              centerX - 0.3, centerY, centerZ, //body - front middle
                              centerX, centerY - 1, centerZ, //head - back bottom
                              centerX - 0.3, centerY, centerZ, //head - back middle
                              centerX, centerY, centerZ - 1, //head - front
                              centerX, centerY, centerZ - 1, //head - front
                              centerX, centerY + 1, centerZ, //head - back top
                              centerX - 0.3, centerY, centerZ, //head - back middle
                              centerX, centerY + 0.5, centerZ + 0.5, //top fin - middle body
                              centerX, centerY + 1, centerZ, //top fin - front body
                              centerX, centerY + 1.2, centerZ + 1, //top fin - out
                              centerX + 0.01, centerY + 0.5, centerZ + 0.5, //top fin - middle body
                              centerX + 0.01, centerY + 1, centerZ, //top fin - front body
                              centerX + 0.01, centerY + 1.2, centerZ + 1, //top fin - out
                             ];
        const normalDataBody = [1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,];
        const vertexDataTail = [centerX, centerY, centerZ + 2, //front
                                centerX, centerY - 0.5, centerZ + 2.5, //back bottom
                                centerX, centerY + 0.5, centerZ + 2.5 //back top
                               ]; 
        const normalDataTail = [normal,0,0,
                                normal,0,0,
                                normal,0,0];
        let colorDataBody = [];
        let colorDataTail = [];
        let faceColor = [1, 0.584, 0.078];
        for (let vertex = 0; vertex < 30; vertex++) {
            colorDataBody.push(...faceColor);
            colorDataTail.push(...faceColor);
        }

        this.vdb = [
                              centerX, centerY, centerZ + 2, //body - back
                              centerX, centerY - 1, centerZ, //body - front bottom 
                              centerX + 0.3, centerY, centerZ, //body - front middle
                              centerX, centerY, centerZ + 2, //body - back
                              centerX, centerY + 1, centerZ, //body - front top
                              centerX + 0.3, centerY, centerZ, //body - front middle
                              centerX, centerY - 1, centerZ, //head - back bottom
                              centerX + 0.3, centerY, centerZ, //head - back middle
                              centerX, centerY, centerZ - 1, //head - front
                              centerX, centerY, centerZ - 1, //head - front
                              centerX, centerY + 1, centerZ, //head - back top
                              centerX + 0.3, centerY, centerZ, //head - back middle
                              centerX, centerY, centerZ + 2, //body - back
                              centerX, centerY - 1, centerZ, //body - front bottom 
                              centerX - 0.3, centerY, centerZ, //body - front middle
                              centerX, centerY, centerZ + 2, //body - back
                              centerX, centerY + 1, centerZ, //body - front top
                              centerX - 0.3, centerY, centerZ, //body - front middle
                              centerX, centerY - 1, centerZ, //head - back bottom
                              centerX - 0.3, centerY, centerZ, //head - back middle
                              centerX, centerY, centerZ - 1, //head - front
                              centerX, centerY, centerZ - 1, //head - front
                              centerX, centerY + 1, centerZ, //head - back top
                              centerX - 0.3, centerY, centerZ, //head - back middle
                              centerX, centerY + 0.5, centerZ + 0.5, //top fin - middle body
                              centerX, centerY + 1, centerZ, //top fin - front body
                              centerX, centerY + 1.2, centerZ + 1, //top fin - out
                              centerX + 0.01, centerY + 0.5, centerZ + 0.5, //top fin - middle body
                              centerX + 0.01, centerY + 1, centerZ, //top fin - front body
                              centerX + 0.01, centerY + 1.2, centerZ + 1, //top fin - out
                             ];
        this.ndb = [1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,
                                1,0,0,
                                1,0,0,
                                1,0,0,
                                -1,0,0,
                                -1,0,0,
                                -1,0,0,];
        this.vdt = [centerX, centerY, centerZ + 2, //front
                    centerX, centerY - 0.5, centerZ + 2.5, //back bottom
                    centerX, centerY + 0.5, centerZ + 2.5]; //back top
        this.ndt = [normal,0,0,
                    normal,0,0,
                    normal,0,0];
        this.speed = speed;
        this.direction = direction;
        this.body = new GForm(vertexDataBody, colorDataBody,normalDataBody);
        this.tail = new GForm(vertexDataTail, colorDataTail,normalDataTail);
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
        for (let triangle = 0; triangle < 30; triangle++) {
            let x = triangle * 3;
            let y = (triangle * 3) + 2;
            this.body.vertices[x] = (this.vdb[x] * cos) - (this.vdb[y] * sin);
            this.body.vertices[y] = (this.vdb[x] * sin) + (this.vdb[y] * cos);
            this.body.normalData[x] = (this.ndb[x] * cos);// - (this.ndb[y] * sin);
            this.body.normalData[y] = (this.ndb[x] * sin);// + (this.ndb[y] * cos);
        }
        //tail
        for (let triangle = 0; triangle < 3; triangle++) {
            let x = triangle * 3;
            let y = (triangle * 3) + 2;
            this.tail.vertices[x] = (this.vdt[x] * cos) - (this.vdt[y] * sin);
            this.tail.vertices[y] = (this.vdt[x] * sin) + (this.vdt[y] * cos);
            this.tail.normalData[x] = (this.ndt[x] * cos);// - (this.ndb[y] * sin);
            this.tail.normalData[y] = (this.ndt[x] * sin);// + (this.ndb[y] * cos);
        }
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

class ShadedFish {
    constructor(centerX, centerY, centerZ, speed, direction) {
        this.leftSide = new Fish(centerX, centerY, centerZ, speed, direction, -1);
        this.rightSide = new Fish(centerX + 0.01, centerY, centerZ, speed, direction, 1);
        //this.myFish = new Fish3D(centerX, centerY, centerZ, speed, direction, -1);
    }
    
    draw() {
        this.leftSide.draw();
        this.rightSide.draw();
        //this.myFish.draw();
    }
}

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
const mat4 = glMatrix.mat4

if (!gl) {
    throw new Error('WebGL not supported');
}

//--------- SHADER PROGRAM -------
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;
    //0.57735, 0.57735, 0.57735 para luz angulada en 45 grados en las 3 direcciones
    //0.2, 0.7, 0.3162
    const vec3 lightDirection = normalize(vec3(0.57735, 0.57735, 0.57735));
    const float ambient = 0.5;
    attribute vec3 position;
    attribute vec2 uv;
    attribute vec3 normal;
    varying vec2 vUV;
    varying float vBrightness;
    uniform mat4 matrix;
    uniform mat4 normalMatrix;
    attribute vec3 color;
    varying vec3 vColor;
    void main() {        
        vec3 worldNormal = (normalMatrix * vec4(normal, 1)).xyz;
        float diffuse = max(0.0, dot(worldNormal, lightDirection));
        vUV = uv;
        vColor = color;
        vBrightness = ambient + diffuse;
        gl_Position = matrix * vec4(position, 1);
    }
`);
gl.compileShader(vertexShader);



const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;
    varying vec2 vUV;
    varying float vBrightness;
    uniform sampler2D textureID;
    varying vec3 vColor;
    void main() {
        vec4 texel = vec4(vColor, 1);
        texel.xyz *= vBrightness;
        gl_FragColor = texel;
    }
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

const attribs = {
    positionLocation: gl.getAttribLocation(program, `position`),
    colorLocation: gl.getAttribLocation(program, `color`),
    normalLocation: gl.getAttribLocation(program, `normal`)
};

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
    matrix: gl.getUniformLocation(program, `matrix`),
    normalMatrix: gl.getUniformLocation(program, `normalMatrix`),
};

//gl.uniform1i(uniformLocations.textureID, 0);






//-------- OBJECTS ----------
const vertexDataCube = [
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
const normalDataCube = [
    ...repeat(6, [0, 0, 1]),    // Z+
    ...repeat(6, [-1, 0, 0]),   // X-
    ...repeat(6, [0, 0, -1]),   // Z-
    ...repeat(6, [1, 0, 0]),    // X+
    ...repeat(6, [0, 1, 0]),    // Y+
    ...repeat(6, [0, -1, 0]),   // Y-
]
const uvDataCube = repeat(6, [
    1, 1, // top right
    1, 0, // bottom right
    0, 1, // top left

    0, 1, // top left
    1, 0, // bottom right
    0, 0  // bottom left
]);

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
const normalDataOceanFloor = [
// cube
    // Bottom
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
];

let colorDataOceanFloor = [];
for (let face = 0; face < 1; face++) {
    let faceColor = [0.940, 0.889, 0.602];
    for (let vertex = 0; vertex < 6; vertex++) {
        colorDataOceanFloor.push(...faceColor);
    }
}


function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
}

let cubeColors = [];
for (let i = 0; i < 1; i++) {
    let colorData = [];
    for (let face = 0; face < 6; face++) {
        let faceColor = randomColor();
        for (let vertex = 0; vertex < 6; vertex++) {
            colorData.push(...faceColor);
        }
    }
    cubeColors.push(colorData);
}
for (let i = 0; i < 1; i++) {
    let colorData = [];
    let faceColor = randomColor();
    for (let face = 0; face < 6; face++) {
        for (let vertex = 0; vertex < 6; vertex++) {
            colorData.push(...faceColor);
        }
    }
    cubeColors.push(colorData);
}
//console.log(gl.getShaderInfoLog(fragmentShader));



//------ OBJECT DECLARATION -------
let myCube = new GForm(vertexDataCube, cubeColors[1],normalDataCube);
let oceanFloor = new GForm(vertexDataOceanFloor, colorDataOceanFloor, normalDataOceanFloor);
let fishArray = [];
for (let i = 0; i < 1; i++) {
    //(x,y,z,speed,direction)
    let fish = new Fish(randomIntFromInterval(3,10), randomIntFromInterval(1,10), 0, randomFloatFromInterval(3,10), -1,1);
    fishArray.push(fish);
}
//let fish = new Fish(5, 2, 0, 5, -1);
//let fish2 = new Fish(7, 3, 0, 6 ,-1);
//let fish3 = new Fish(3, 1, 0, 3, -1);







//-------- MATRICES -----------
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
//mat4.invert(modelMatrix,modelMatrix);
mat4.translate(viewMatrix, viewMatrix, [-1, -1, 0]);
mat4.invert(viewMatrix, viewMatrix);

const normalMatrix = mat4.create(); //normal matrix for lightning

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
    
    
    

    
    mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
    
    mat4.invert(normalMatrix,modelMatrix); 
    //si se multiplica por modelMatrix la es independiente de la camara
    //si se multiplica por viewMatrix la luz viene de la camara
    /* si se quiere que la luz salga de la camara es necesario cambiar la dirección de la luz
       en la definición del shader a [0,1,1] para que vaya en línea recta sobre x
    */
    mat4.transpose(normalMatrix,normalMatrix);
    
    gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);
    
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

// Construct an Array by repeating `pattern` n times
function repeat(n, pattern) {
    return [...Array(n)].reduce(sum => sum.concat(pattern), []);
}