//Cria um objeto e adiciona no array para imprimir na tela
var objIndex = 0;

function createObj(name) {

  var newObj = {
    name: `${objIndex}`,
    index: objIndex,
    translation: [0, 0, 0],
    children: [],
    vao: pyraVAO,
    bufferInfo: pyramidBufferInfo,
  }

  if(name == "pyramid") {
    newObj.vao = pyraVAO;
    newObj.bufferInfo= pyramidBufferInfo;
  }
  else if(name == "amongus"){
    newObj.vao = amongusVAO;
    newObj.bufferInfo= amongusBufferInfo;
  }
  else {
    newObj.vao = cubeVAO;
    newObj.bufferInfo= cubeBufferInfo;
  }

  var objData = {
    translation: {
      x: 0,
      y: 0,
      z: 0,
    },
    rotation: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    },
    scale : {
      x: 0,
      y: 0,
      z: 0,
    }
  }

  uiObj.objArray.push(newObj.name)
  console.log(uiObj.objArray);
  
  objeto.children.push(newObj);

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};

  scene = makeNode(objeto);
  objIndex++;
  gui.destroy();
  gui = null;
}

var arrays_pyramid = {
    position: new Float32Array([
      1, -1, 1,
      -1, -1, 1,
      -1, -1, -1,
      1, -1, -1,
      1, -1, 1,
      -1, -1, 1,
      0, 1, 0,
      -1, -1, 1,
      -1, -1, -1,
      0, 1, 0,
      -1, -1, -1,
      1, -1, -1,
      0, 1, 0,
      1, -1, -1,
      1, -1, 1,
      0, 1, 0,

    ]),

    indices: new Uint16Array([
      0, 1, 2,
      0, 2, 3, 
      4, 5, 6,
      7, 8, 9,
      10, 11, 12,
      13, 14, 15

    ]),
  };


  var arrays_cube = {
    // vertex positions for a cube
    position: [
      1, 1, -1, 
      1, 1, 1, 
      1, -1, 1, 
      1, -1, -1,
      -1, 1, 1,
      -1, 1, -1,
      -1, -1, -1,
      -1, -1, 1,
      -1, 1, 1,
      1, 1, 1,
      1, 1, -1,
      -1, 1, -1,
      -1, -1, -1,
      1, -1, -1,
      1, -1, 1,
      -1, -1, 1,
      1, 1, 1,
      -1, 1, 1,
      -1, -1, 1,
      1, -1, 1,
      -1, 1, -1,
      1, 1, -1,
      1, -1, -1,
      -1, -1, -1,
    ],
  
    indices: [
      0, 1, 2, 
      0, 2, 3, 

      4, 5, 6, 
      4, 6, 7,

      8, 9, 10,
      8, 10, 11,

      12, 13, 14,
      12, 14, 15,

      16, 17, 18,
      16, 18, 19,

      20, 21, 22,
      20, 22, 23,
    ],
  };
  