"use strict";

var vs = `#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {

  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`;

var fs = `#version 300 es

precision highp float;

// Passed in from the vertex shader.
in vec4 v_color;

uniform vec4 u_colorMult;
uniform vec4 u_colorOffset;

out vec4 outColor;

void main() {
   outColor = v_color * u_colorMult + u_colorOffset;
}
`;

var TRS = function() {
  this.translation = [0, 0, 0];
  this.rotation = [0, 0, 0];
  this.scale = [1, 1, 1];
};

TRS.prototype.getMatrix = function(dst) {
  dst = dst || new Float32Array(16);
  var t = this.translation;
  var r = this.rotation;
  var s = this.scale;

  // compute a matrix from translation, rotation, and scale
  m4.translation(t[0], t[1], t[2], dst);
  m4.xRotate(dst, r[0], dst);
  m4.yRotate(dst, r[1], dst);
  m4.zRotate(dst, r[2], dst);
  m4.scale(dst, s[0], s[1], s[2], dst);
  return dst;
};

var Node = function (source) {
  this.children = [];
  this.localMatrix = m4.identity();
  this.worldMatrix = m4.identity();
  this.source = source;
};

Node.prototype.setParent = function (parent) {
  // remove us from our parent
  if (this.parent) {
    var ndx = this.parent.children.indexOf(this);
    if (ndx >= 0) {
      this.parent.children.splice(ndx, 1);
    }
  }

  // Add us to our new parent
  if (parent) {
    parent.children.push(this);
  }
  this.parent = parent;
};

Node.prototype.updateWorldMatrix = function (matrix) {
  var source = this.source;
  if (source) {
    source.getMatrix(this.localMatrix);
  }

  if (matrix) {
    // a matrix was passed in so do the math
    m4.multiply(matrix, this.localMatrix, this.worldMatrix);
  } else {
    // no matrix was passed in so just copy.
    m4.copy(this.localMatrix, this.worldMatrix);
  }

  // now process all the children
  var worldMatrix = this.worldMatrix;
  this.children.forEach(function (child) {
    child.updateWorldMatrix(worldMatrix);
  });
};

var cubeVAO;
var cubeBufferInfo;
var pyramidBufferInfo;
var pyraVAO;

var objectsToDraw = [];
var objects = [];
var nodeInfosByName = {};
var scene;
var objeto = {};
var countF = 0;
var countC = 0;
var programInfo;

//CAMERA VARIABLES
var cameraPosition;
var target;
var up;

function makeNode(nodeDescription) {
  var trs = new TRS();
  var node = new Node(trs);
  nodeInfosByName[nodeDescription.name] = {
    trs: trs,
    node: node,
  };
  trs.translation = nodeDescription.translation || trs.translation;
  if (nodeDescription.draw !== false) {
    node.drawInfo = {
      uniforms: {
        u_colorOffset: [0,0,0,1],
        u_colorMult: [1, 1, 1, 1],
      },
      programInfo: programInfo,
      bufferInfo: nodeDescription.bufferInfo,
      vertexArray: nodeDescription.vao,
    };
    objectsToDraw.push(node.drawInfo);
    objects.push(node);
  }
  makeNodes(nodeDescription.children).forEach(function (child) {
    child.setParent(node);
  });
  return node;
}

function makeNodes(nodeDescriptions) {
  return nodeDescriptions ? nodeDescriptions.map(makeNode) : [];
}
function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // Tell the twgl to match position with a_position, n
  // normal with a_normal etc..
  twgl.setAttributePrefix("a_");
  //cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 1);

  cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_cube);
  pyramidBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_pyramid);
  

  // setup GLSL program
  
  programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  cubeVAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);
  pyraVAO = twgl.createVAOFromBufferInfo(gl, programInfo, pyramidBufferInfo);

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};
    
  
  // Let's make all the nodes
  objeto = {
    name: "scene",
    draw: false,
    children: [ {
      name: "0",
      translation: [0, 0, 0],
      children: [],
      vao: cubeVAO,
      bufferInfo: cubeBufferInfo,
    },
    ] 
  };
  
  scene = makeNode(objeto);

  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  var fieldOfViewRadians = degToRad(60);


  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    if(gui == null) {
      createGUI();
    }
    
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 200);

    // Compute the camera's matrix using look at.
    cameraPosition = [uiCamera.x, uiCamera.y, uiCamera.z];
    target = [uiCamera.tx, uiCamera.ty, uiCamera.tz];
    up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);
    
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    nodeInfosByName[`${uiObj["Select Object Index"]}`].trs.rotation = [uiObj.rotation.x, uiObj.rotation.y, uiObj.rotation.z];
    nodeInfosByName[`${uiObj["Select Object Index"]}`].trs.translation = [uiObj.translation.x, uiObj.translation.y, uiObj.translation.z];
    nodeInfosByName[`${uiObj["Select Object Index"]}`].trs.scale = [uiObj.scale.x, uiObj.scale.y, uiObj.scale.z];

    // Update all world matrices in the scene graph
    scene.updateWorldMatrix();

    // Compute all the matrices for rendering
    objects.forEach(function (object) {
      object.drawInfo.uniforms.u_matrix = m4.multiply(
        viewProjectionMatrix,
        object.worldMatrix
      );
    });

    // ------ Draw the objects --------

    twgl.drawObjectList(gl, objectsToDraw);
    console.log(100);

    requestAnimationFrame(drawScene);
  }
}

main();