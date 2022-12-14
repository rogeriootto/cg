"use strict";

var vs = `#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;

uniform mat4 u_matrix;
uniform mat4 u_world;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;

out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_normal = mat3(u_worldInverseTranspose) * a_normal;

  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}
`;

var fs = `#version 300 es

precision highp float;

// Passed in from the vertex shader.

in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

uniform vec4 u_color;
uniform float u_shininess;
uniform vec3 u_lightColor;
uniform vec3 u_specularColor;

out vec4 outColor;

void main() {
  vec3 normal = normalize(v_normal);

  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  float light = dot(normal, surfaceToLightDirection);
  float specular = 0.0;

  if (light > 0.0) {
    specular = pow(dot(normal, halfVector), u_shininess);
  }

  outColor = u_color;

  outColor.rgb *= light * u_lightColor;
  outColor.rgb += specular * u_specularColor;
}
`;

//wireframe
var vsw = `
#version 300 es

in vec3 a_barycentric;
in vec4 a_position;
in vec3 a_normal;

uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;

uniform mat4 u_matrix;
uniform mat4 u_world;
uniform mat4 u_worldInverseTranspose;

out vec3 vbc;
out vec3 v_normal;

out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

void main() {
  // Multiply the position by the matrix.
  vbc = a_barycentric;
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_normal = mat3(u_worldInverseTranspose) * a_normal;

  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
} 
`;

var fsw = `
#version 300 es

precision highp float;

in vec3 vbc;

// Passed in from the vertex shader.

in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

uniform vec4 u_color;
uniform float u_shininess;

out vec4 outColor;

void main() {
  vec3 normal = normalize(v_normal);

  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  float light = dot(v_normal, surfaceToLightDirection);
  float specular = 0.0;

  if(vbc.x < 0.03 || vbc.y < 0.03 || vbc.z < 0.03) {
    outColor = vec4(0.0, 0.0, 0.0, 1.0);
  } 
  else {
    outColor = vec4(0.0, 0.0, 0.0, 0);
  }
}
`;

//textura
var vst = `
#version 300 es
in vec4 a_position;
in vec3 a_normal;
in vec2 a_texcoord;
 
uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;

uniform mat4 u_matrix;
uniform mat4 u_world;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;

out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;
 
// a varying to pass the texture coordinates to the fragment shader
out vec2 v_texcoord;
 
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
 
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;

  // Pass the color to the fragment shader.
  v_normal = mat3(u_worldInverseTranspose) * a_normal;

  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}
`;

var fst = `
#version 300 es
precision highp float;
 
// Passed in from the vertex shader.
in vec2 v_texcoord;
in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

// The texture.
uniform sampler2D u_texture;
uniform float u_shininess;
 
out vec4 outColor;
 
void main() {
   
  vec3 normal = normalize(v_normal);

  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  float light = dot(v_normal, surfaceToLightDirection);
  float specular = 0.0;

  if (light > 0.0) {
    specular = pow(dot(normal, halfVector), u_shininess);
  }

  outColor = texture(u_texture, v_texcoord);

  outColor.rgb *= light;
  outColor.rgb += specular;
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

var then = 0;

var texture;

var cubeVAO;
var cubeBufferInfo;
var pyramidBufferInfo;
var pyraVAO;
var amongusVAO;
var amongusBufferInfo;
var triangleVAO;
var triangleBufferInfo;

var objectsToDraw = [];
var objects = [];
var nodeInfosByName = {};
var scene;
var objeto = {};
var programInfo;
var programInfoWireframe;
var programInfoTexture;
var gl;

//CAMERA VARIABLES
var cameras = [{
  cameraPosition: [0,0,4],
  target: [0,0,0],
  up: [0, 1, 0],
},
{
  cameraPosition: [3,-2,4],
  target: [0,0,0],
  up: [0, 1, 0],
},
{
  cameraPosition: [-2,1,4],
  target: [0,0,0],
  up: [0, 1, 0],
}
];

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
        //u_color: [0.2, 1, 0.2, 1],
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

const calculateBarycentric = (length) => {
  const n = length / 6;
  const barycentric = [];
  for (let i = 0; i < n; i++) barycentric.push(1, 0, 0, 0, 1, 0, 0, 0, 1);
  return barycentric;
};

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  //Calcula a normal dos objetos para inicializa????o:
  arrays_cube.normal = calculateNormal(arrays_cube.position, arrays_cube.indices);
  arrays_cube.barycentric = calculateBarycentric(arrays_cube.position.length);
  arrays_pyramid.normal = calculateNormal(arrays_pyramid.position, arrays_pyramid.indices);
  arrays_pyramid.barycentric = calculateBarycentric(arrays_pyramid.position.length);

  triangleData.normal = calculateNormal(triangleData.position, triangleData.indices);
  triangleData.barycentric = calculateBarycentric(triangleData.position.length);

  // Tell the twgl to match position with a_position, n
  // normal with a_normal etc..
  twgl.setAttributePrefix("a_");
  //cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 1);

  cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_cube);
  pyramidBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_pyramid);
  triangleBufferInfo = twgl.createBufferInfoFromArrays(gl, triangleData);
  
  // setup GLSL program
  
  programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  programInfoWireframe = twgl.createProgramInfo(gl, [vsw, fsw]);
  programInfoTexture = twgl.createProgramInfo(gl, [vst, fst]);

  cubeVAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);
  pyraVAO = twgl.createVAOFromBufferInfo(gl, programInfo, pyramidBufferInfo);
  triangleVAO = twgl.createVAOFromBufferInfo(gl, programInfo, triangleBufferInfo);

  texture = twgl.createTextures(gl, {clover: {src: "texture.png"}});

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};
    
  if(gui == null) {
    createGUI();
  }
  
  // Let's make all the nodes
  objeto = {
    name: "scene",
    translation: [0,0,0],
    rotation: [0,0,0],
    scale: [0,0,0],
    draw: false,
    children: [] 
  };

  //createObj("pyramid");
  
  scene = makeNode(objeto);

  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  var fieldOfViewRadians = degToRad(60);

  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(now) {
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
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000); //FOV, aspectRatio, NearPlane, FarPlane

    cameras[uiCamera.selectedCamera].cameraPosition = [uiCamera.x, uiCamera.y, uiCamera.z];
    cameras[uiCamera.selectedCamera].target = [uiCamera.x, uiCamera.ty, uiCamera.z - 10];

    // Compute the camera's matrix using look at.
    var cameraMatrix = m4.lookAt(cameras[uiCamera.selectedCamera].cameraPosition, cameras[uiCamera.selectedCamera].target, cameras[uiCamera.selectedCamera].up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);
    
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    
    var fRotationRadians = degToRad(uiObj.rotation.y);

    if(uiObj.isObjectSelected) {
      if(!uiObj.isAnimationPlaying){
        nodeInfosByName[uiObj.selectedName].trs.rotation = [uiObj.rotation.x, uiObj.rotation.y, uiObj.rotation.z];
      }
      nodeInfosByName[uiObj.selectedName].trs.translation = [uiObj.translation.x, uiObj.translation.y, uiObj.translation.z];
      nodeInfosByName[uiObj.selectedName].trs.scale = [uiObj.scale.x, uiObj.scale.y, uiObj.scale.z];

      if(uiObj.isAnimationPlaying) { //Anima????o
        now *= 0.001;
        //console.log(`now ${now}, then ${then}`);
        var deltaTime = now - then;
        //console.log(deltaTime);
        then = now;
        nodeInfosByName[uiObj.selectedName].trs.rotation[1] += (deltaTime * uiObj.animationSpeed);
      }
      
    }

    if(uiObj.destruction) {
      createVertice(0);
    }

    // Update all world matrices in the scene graph
    scene.updateWorldMatrix();

    var colorNormalized = [];
    for(let i=0; i<uiObj.color.length - 1; i++) {
      colorNormalized.push(uiObj.color[i]/255);
    }
    colorNormalized.push(1);

    var lightColorNormalized = [];
    for(let i=0; i<luz.lightColor.length - 1; i++) {
      lightColorNormalized.push(luz.lightColor[i]/255);
    }

    var specularColorNormalized = [];
    for(let i=0; i<luz.specularColor.length - 1; i++) {
      specularColorNormalized.push(luz.specularColor[i]/255);
    }


    // Compute all the matrices for rendering
    objects.forEach(function (object) {
      
      object.drawInfo.uniforms.u_lightColor = lightColorNormalized;

      object.drawInfo.uniforms.u_specularColor = specularColorNormalized; 

      object.drawInfo.uniforms.u_matrix = m4.multiply(
        viewProjectionMatrix,
        object.worldMatrix
      );
        
      object.drawInfo.uniforms.u_lightWorldPosition = [luz.x, luz.y, luz.z];

      object.drawInfo.uniforms.u_world = m4.multiply(object.worldMatrix, m4.yRotation(fRotationRadians));

      object.drawInfo.uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(object.worldMatrix));
      
      object.drawInfo.uniforms.u_viewWorldPosition = cameras[uiCamera.selectedCamera].cameraPosition;

      object.drawInfo.uniforms.u_shininess = uiObj.shininess;

      object.drawInfo.uniforms.u_color= colorNormalized;
    });

    
    // ------ Draw the objects --------

    twgl.drawObjectList(gl, objectsToDraw);

    requestAnimationFrame(drawScene);
  }
}

main();