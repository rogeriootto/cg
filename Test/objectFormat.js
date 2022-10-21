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
    newObj.vao =pyraVAO;
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
      0, 1, 0,

      -1, -1, 1,

      1, -1, 1,

      0, 1, 0,

      1, -1, 1,

      1, -1, -1,

      0, 1, 0,

      1, -1, -1,

      -1, -1, -1,

      0, 1, 0,

      -1, -1, -1,

      -1, -1, 1,
    ]),

    indices: new Uint16Array([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 8, 4, 1, 8, 5, 2,
    ]),
    normal: new Float32Array([
      1, -1, 1,

      1, -1, 1,

      1, 1, 1,

      -1, 1, 1,

      -1, -1, -1,

      -1, 1, -1,
    ]),
  };


  var arrays_cube = {
    // vertex positions for a cube
    position: new Float32Array([
      1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1,
      -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1,
      1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1,
      1, -1, 1, -1, -1, -1, -1, -1,
    ]),
    // vertex normals for a cube
    normal: new Float32Array([
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
      -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      0, 0, -1,
    ]),
    indices: new Uint16Array([
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
      14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
    ]),
  };
  