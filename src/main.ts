import vsSource from '/@/shaders/vertex.glsl';
import fsSource from '/@/shaders/fragment.glsl';

import { getWebGLContext, initShaderProgram } from '/@/utils';
// import { mat4 } from 'gl-matrix';

var cubeRotation = 0.0;
//将球横纵划分成50X50的网格
const Y_SEGMENTS = 50;
const X_SEGMENTS = 50;

interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number;
    vertexColor: number;
  };
}

interface Buffers {
  position: WebGLBuffer;
  indices: WebGLBuffer;
  color: WebGLBuffer;
}

main();

function main() {
  const gl = getWebGLContext('glCanvas');

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  gl.viewport(100, 100, 400, 400); // 设置视口

  const programInfo: ProgramInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    // uniformLocations: {
    //   projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
    //   modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    // }
  };

  const buffers = initBuffers(gl);

  drawScene(gl, programInfo, buffers);
  // Draw the scene repeatedly
  // function render(now) {
  //   now *= 0.001;  // convert to seconds
  //   const deltaTime = now - then;
  //   then = now;

  //   drawScene(gl, programInfo, buffers, deltaTime);

  //   requestAnimationFrame(render);
  // }
  // requestAnimationFrame(render);
}

/**
 * 初始化缓冲区
 * @param gl
 * @returns
 */
function initBuffers(gl: WebGL2RenderingContext): Buffers {
  // 创建顶点缓冲区
  const positionBuffer = gl.createBuffer();

  // 讲顶点缓冲区绑定为数组类型
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 获取顶点数据
  const positions = getPositionData();

  console.log({ positions });
  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // colors

  const faceColors = [
    [1.0, 1.0, 1.0, 0.5], // Front face: white
    [1.0, 0.0, 0.0, 0.6], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.
  // TODO: 暂定为一种色
  var colors = [1.0, 1.0, 0.0, 1.0];

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  // 索引缓冲区
  const indices = getIndicesData();
  const indexBuffer = gl.createBuffer();

  // 指定缓冲区类型
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}

//
// Draw the scene.
//
function drawScene(gl: WebGL2RenderingContext, programInfo: ProgramInfo, buffers: Buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  {
    const vertexCount = Y_SEGMENTS * X_SEGMENTS * 6;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.LINE_STRIP, vertexCount, type, offset);
  }
}

/**
 * 获取顶点数据
 */
function getPositionData() {
  // 圆顶点数组
  const PI = Math.PI;
  const sin = Math.sin;
  const cos = Math.cos;

  const positions: number[] = [];
  // 生成球的顶点
  for (let y = 0; y <= Y_SEGMENTS; y++) {
    for (let x = 0; x <= X_SEGMENTS; x++) {
      const xSegment = x / X_SEGMENTS;
      const ySegment = y / Y_SEGMENTS;
      const xPos = cos(xSegment * 2.0 * PI) * sin(ySegment * PI);
      const yPos = cos(ySegment * PI);
      const zPos = sin(xSegment * 2.0 * PI) * sin(ySegment * PI);

      positions.push(xPos, yPos, zPos);
    }
  }

  return positions;
}

/**
 * 获取索引数据
 */
function getIndicesData() {
  const indices: number[] = [];

  for (let i = 0; i < Y_SEGMENTS; i++) {
    for (let j = 0; j < X_SEGMENTS; j++) {
      indices.push(i * (X_SEGMENTS + 1) + j);
      indices.push((i + 1) * (X_SEGMENTS + 1) + j);
      indices.push((i + 1) * (X_SEGMENTS + 1) + j + 1);

      indices.push(i * (X_SEGMENTS + 1) + j);
      indices.push((i + 1) * (X_SEGMENTS + 1) + j + 1);
      indices.push(i * (X_SEGMENTS + 1) + j + 1);
    }
  }

  return indices;
}
