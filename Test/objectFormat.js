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

  uiObj.objArray.push(newObj.name);
  
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
      1, -1, 1, //0
      -1, -1, 1,//1
      -1, -1, -1,//2

      1, -1, 1, //0
      -1, -1, -1,//2
      1, -1, -1,//3

      0, 1, 0,//8
      -1, -1, 1,//7
      1, -1, 1,//6

      0, 1, 0,//11
      -1, -1, -1,//10
      -1, -1, 1,//9

      0, 1, 0,//14
      1, -1, -1,//13
      -1, -1, -1,//12

      0, 1, 0,//17
      1, -1, 1,//16
      1, -1, -1,//15

    ]),

    indices: new Uint16Array([
      0,1,2,
      3,4,5,

      6,7,8,
      9,10,11,
      12,13,14,
      15,16,17,
    ]),
  };


  var arrays_cube = {
    // vertex positions for a cube
    position: [
      1, 1, -1, //0
      1, 1, 1, //1
      1, -1, 1, //2

      1, 1, -1, //0
      1, -1, 1, //2
      1, -1, -1,//3

      -1, 1, 1,//4
      -1, 1, -1,//5
      -1, -1, -1,//6

      -1, 1, 1,//4
      -1, -1, -1,//6
      -1, -1, 1,//7

      -1, 1, 1,//8
      1, 1, 1,//9
      1, 1, -1,//10

      -1, 1, 1,//8
      1, 1, -1,//10
      -1, 1, -1,//11

      -1, -1, -1,//12
      1, -1, -1,//13
      1, -1, 1,//14

      -1, -1, -1,//12
      1, -1, -1,//13
      -1, -1, 1,//15

      1, 1, 1,//16
      -1, 1, 1,//17
      -1, -1, 1,//18

      1, 1, 1,//16
      -1, -1, 1,//18
      1, -1, 1,//19

      -1, 1, -1,//20
      1, 1, -1,//21
      1, -1, -1,//22
      
      -1, 1, -1,//20
      1, -1, -1,//22
      -1, -1, -1,//23
    ],
  
    indices: [
      0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,
    ],
  };
  