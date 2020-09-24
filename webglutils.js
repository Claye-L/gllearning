var compile = (gl, vshader, fshader) => {
    // Compile vertex shader
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vshader);
    gl.compileShader(vs);
    // Compile fragment shader
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fshader);
    gl.compileShader(fs);
    // Create and launch the WebGL program
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    // Log errors (optional)
    console.log('vertex shader:', gl.getShaderInfoLog(vs) || 'OK');
    console.log('fragment shader:', gl.getShaderInfoLog(fs) || 'OK');
    console.log('program:', gl.getProgramInfoLog(program) || 'OK');
    return program;
}

// Bind a data buffer to an attribute, fill it with data and enable it
var buffer = (gl, data, program, attribute, size, type) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    var a = gl.getAttribLocation(program, attribute);
    gl.vertexAttribPointer(a, size, type, false, 0, 0);
    gl.enableVertexAttribArray(a);
  }

var identityMat4 = () => {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  };
  
  // Compute the multiplication of two mat4 (c = a x b)
var multMat4Mat4 = (a, b) => {
    var i, e, a, b, ai0, ai1, ai2, ai3;
    var c = new Float32Array(16);
    for (i = 0; i < 4; i++) {
      ai0 = a[i];
      ai1 = a[i+4];
      ai2 = a[i+8];
      ai3 = a[i+12];
      c[i]    = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3];
      c[i+4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7];
      c[i+8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11];
      c[i+12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
    }
    return c;
  };
  
  // Get the transposed of a mat4
var transpose = m => {
    return new Float32Array([
      m[0], m[4], m[8],  m[12],
      m[1], m[5], m[9],  m[13],
      m[2], m[6], m[10], m[14],
      m[3], m[7], m[11], m[15]
    ]);
  };
  
  // Transform a mat4
  // options: x/y/z (translate), rx/ry/rz (rotate), sx/sy/sz (scale)
  var transform = (mat, options) => {
    var out = new Float32Array(mat);
    var x = options.x || 0, y = options.y || 0, z = options.z || 0;
    var sx = options.sx || 1, sy = options.sy || 1, sz = options.sz || 1;
    var rx = options.rx, ry = options.ry, rz = options.rz;
    
    // translate
    if(x || y || z){
      out[12] += out[0] * x + out[4] * y + out[8]  * z;
      out[13] += out[1] * x + out[5] * y + out[9]  * z;
      out[14] += out[2] * x + out[6] * y + out[10] * z;
      out[15] += out[3] * x + out[7] * y + out[11] * z;
    }
    
    // Rotate
    if(rx){
      out.set(multMat4Mat4(out, new Float32Array([
        1, 0, 0, 0,
        0, Math.cos(rx), Math.sin(rx), 0,
        0, -Math.sin(rx), Math.cos(rx), 0,
        0, 0, 0, 1
      ])));
    }
    if(ry){
      out.set(multMat4Mat4(out, new Float32Array([
        Math.cos(ry), 0, -Math.sin(ry), 0,
        0, 1, 0, 0,
        Math.sin(ry), 0, Math.cos(ry), 0,
        0, 0, 0, 1
      ])));
    }
    if(rz){
      out.set(multMat4Mat4(out, new Float32Array([
        Math.cos(rz), Math.sin(rz), 0, 0,
        -Math.sin(rz), Math.cos(rz), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ])));
    }
    
    // Scale
    if(sx !== 1){
      out[0] *= sx, out[1] *= sx, out[2] *= sx, out[3] *= sx;
    }
    if(sy !== 1){
      out[4] *= sy, out[5] *= sy, out[6] *= sy, out[7] *= sy;
    }
    if(sz !== 1){
      out[8] *= sz, out[9] *= sz, out[10] *= sz, out[11] *= sz;
    }
    
    return out;
  };