/**
 * 获取 webGL2上下文
 * @params
 */
export function getWebGLContext(dom: HTMLCanvasElement | string) {
  let _canvas: HTMLCanvasElement
  if (!dom) return null
  if (typeof dom === 'string') {
    _canvas = document.getElementById(dom) as HTMLCanvasElement
    if(_canvas.nodeName !== 'CANVAS')
      console.error('thisn\'t a canvas element, select again please')
  } else {
    _canvas = dom
  }
  const gl: WebGL2RenderingContext = _canvas.getContext('webgl2');

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  return gl
}


/**
 * Initialize a shader program, so WebGL knows how to draw our data
 */

export function initShaderProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

/**
 * creates a shader of the given type, uploads the source and compiles it.
 * 创建一个指定类型的着色器，加载程序并编译
 * @returns WebGLShader
 */
function loadShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}