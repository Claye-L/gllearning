// Get the WebGL rendering context
var canvas = document.getElementById("canvas");
var gl = canvas.getContext('webgl');

// Vertex shader
var vshader = `
attribute vec4 position;
void main() {
  gl_Position = position;
}`;

// Fragment shader
var fshader = `
precision mediump float;
uniform vec4 color;
void main() {
  gl_FragColor = color;
}`;

var program = compile(gl, vshader, fshader);
var position = gl.getAttribLocation(program, "position");
var color = gl.getUniformLocation(program, 'color');
gl.uniform4f(color, 1, 0, 0, 1);

var vertices = new Float32Array([-0.5,0.5,0,
  -0.5,-0.5,0,
  0.5,-0.5,0,
  0.5,-0.5,0,
  0.5,0.5,0,
  -0.5,0.5,0,]);
buffer(gl, vertices, program, 'position', 3, gl.FLOAT)

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(
    gl.TRIANGLES, // mode
    0,         // starting point
    6          // number of points to draw
);