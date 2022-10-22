//Cria um objeto e adiciona no array para imprimir na tela
var objIndex = 1

function createObj(name) {
  var newObj = {
    name: `${objIndex}`,
    translation: [0, 0, 0],
    children: [],
    vao: pyraVAO,
    bufferInfo: pyramidBufferInfo,
  }

  if(name == "pyramid") {
    newObj.vao = pyraVAO;
    newObj.bufferInfo= pyramidBufferInfo;
  }
  else {
    newObj.vao = cubeVAO;
    newObj.bufferInfo= cubeBufferInfo;
  }
  
  objeto.children.push(newObj);

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};

  scene = makeNode(objeto);
  objIndex++;
  uiObj["Select Object Index"]++;
  console.log(uiObj["Select Object Index"]);
  gui.destroy();
  gui = null;
}

var arrays_pyramid = {
    position: new Float32Array([
      1, 0, 1,
      -1, 0, 1,
      -1, 0, -1,
      1, 0, -1,
      0, 2, 0,
    ]),

    indices: new Uint16Array([
      0, 1, 2,
      0, 2, 3,
      0, 3, 4,
      0, 1, 4,
      1, 2, 4,
      2, 3, 4,

    ]),

    color: new Float32Array([
      1,0,0,1,
      0,1,0,1,
      0,0,1,1,
      1,0,1,1,
      1,1,0,1,
    ]),
  };


  var arrays_cube = {
    // vertex positions for a cube
    position: new Float32Array([

      //base
      1, -1, 1,
      -1, -1, 1,
      -1, -1, -1,
      1, -1, -1,

      //lado
      1, 1, 1,
      1, 1, -1,
      -1, 1, 1,
      -1, 1, -1,

    ]),
    
    indices: new Uint16Array([
      0, 1, 2,
      0, 2, 3,
      0, 3, 4,
      3, 4, 5,
      0, 1, 4,
      1, 4, 6,
      1, 2, 6,
      2, 6, 7,
      2, 3, 7,
      3, 7, 5,
      4, 5, 6,
      6, 7, 5,

    ]),

    color: new Float32Array([
      1, 0, 0, 1,
      0, 1, 0, 1,
      0, 0, 1, 1,
      0, 1, 1, 1,
      1, 0, 1, 1,
      1, 1, 0, 1,
      1, 0, 0, 1,
      1, 0, 1, 1,
    ]),
  };
  