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
  else if(name == "triangle"){
    newObj.vao = triangleVAO;
    newObj.bufferInfo= triangleBufferInfo;
  }
  else {
    newObj.vao = cubeVAO;
    newObj.bufferInfo= cubeBufferInfo;
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
    position: [
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

    ],

    indices: [
      0,1,2,
      3,4,5,

      6,7,8,
      9,10,11,
      12,13,14,
      15,16,17,
    ],
};


  var arrays_cube = {
    // vertex positions for a cube
    position: [

      //lado
      1, 1, -1, //0
      1, 1, 1, //1
      1, -1, 1, //2

      1, 1, -1, //0
      1, -1, 1, //2
      1, -1, -1,//3

      //lado
      -1, 1, 1,//4
      -1, 1, -1,//5
      -1, -1, -1,//6

      -1, 1, 1,//4
      -1, -1, -1,//6
      -1, -1, 1,//7

      //em cima
      -1, 1, 1,//8
      1, 1, 1,//9
      1, 1, -1,//10

      -1, 1, 1,//8
      1, 1, -1,//10
      -1, 1, -1,//11

      //em baixo
      -1, -1, -1,//12
      1, -1, -1,//13
      1, -1, 1,//14

      -1, -1, -1,//12
      1, -1, 1,//14
      -1, -1, 1,//15

      //lado frente
      1, 1, 1,//16
      -1, 1, 1,//17
      -1, -1, 1,//18

      1, 1, 1,//16
      -1, -1, 1,//18
      1, -1, 1,//19

      //lado
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

    texcoord: [
      0.3,0,
      0,0,
      0,1,
      0.3,0,
      0,1,
      0.3,1,

      0.3,0,
      0,0,
      0,1,
      0.3,0,
      0,1,
      0.3,1,

      1,0,
      0.7,0,
      0.7,1,
      1,0,
      0.7,1,
      1,1,

      0.3,0,
      0,0,
      0,1,
      0.3,0,
      0,1,
      0.3,1,

      0.7,0,
      0.3,0,
      0.3,1,
      0.7,0,
      0.3,1,
      0.7,1,

      0.3,0,
      0,0,
      0,1,
      0.3,0,
      0,1,
      0.3,1,
    
    ],
  };

  triangleData = {
    position: [
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
    ],

    indices: [
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
    ],
    
  }

  function createVertice(triangleIndex) {
    buffer = arrays_pyramid;
   
    var triangleIndices = [];
    var triangleVertices = [];
    var novoTri = [];

    for(let i=0, j=0; i< buffer.indices.length; i+=3, j++) {
      if(j == triangleIndex) {
        triangleIndices.push(buffer.indices[i]);
        triangleIndices.push(buffer.indices[i+1]);
        triangleIndices.push(buffer.indices[i+2]);
      }
    }

    for(let i=0, j=0; i < buffer.position.length; i+=3, j++) {

      if(j == triangleIndices[0]) {
        triangleVertices.push(buffer.position[i]);
        triangleVertices.push(buffer.position[i+1]);
        triangleVertices.push(buffer.position[i+2]);
      }

      if(j == triangleIndices[1]) {
        triangleVertices.push(buffer.position[i]);
        triangleVertices.push(buffer.position[i+1]);
        triangleVertices.push(buffer.position[i+2]);
      }

      if(j == triangleIndices[2]) {
        triangleVertices.push(buffer.position[i]);
        triangleVertices.push(buffer.position[i+1]);
        triangleVertices.push(buffer.position[i+2]);
      }
      
    }

    //ponto médio
    var pontoMedio = [];
    //x
    pontoMedio.push((triangleVertices[0] + triangleVertices[3] + triangleVertices[6])/3);
    //y
    pontoMedio.push((triangleVertices[1] + triangleVertices[4] + triangleVertices[7])/3);
    //z
    pontoMedio.push((triangleVertices[2] + triangleVertices[5] + triangleVertices[8])/3);

    //recriar os trianglos

    //deletar o triangulo principal
    //remove dos indices
    for(let i=0, j=0; i< buffer.indices.length; i+=3, j++) {
      if(j == triangleIndex) {
        buffer.indices.splice(i, 3);
      }
    }

    for(let i=0, j=0; i< buffer.indices.length; i+=3, j++) {
      if(j >= triangleIndex) {
        buffer.indices[i] -= 3;
        buffer.indices[i+1] -= 3;
        buffer.indices[i+2] -= 3;
      }
    }

    for(let i=0, j=0; i < buffer.position.length; i+=3, j++) {
      if(j == triangleIndices[0]) {
        buffer.position.splice(i, 3);
      }
    }

    for(let i=0, j=0; i < buffer.position.length; i+=3, j++) {

      if(j == triangleIndices[0]) {
        buffer.position.splice(i, 3);
      }
    }

    for(let i=0, j=0; i < buffer.position.length; i+=3, j++) {

      if(j == triangleIndices[0]) {
        buffer.position.splice(i, 3);
      }
    }

    //triangulo da esquerda
    //0x
    novoTri.push(triangleVertices[0]);
    //0y
    novoTri.push(triangleVertices[1]);
    //0z
    novoTri.push(triangleVertices[2]);

    //4x
    novoTri.push(pontoMedio[0]);
    //4y
    novoTri.push(pontoMedio[1]);
    //4z
    novoTri.push(pontoMedio[2]);

    //2x
    novoTri.push(triangleVertices[6]);
    //2y
    novoTri.push(triangleVertices[7]);
    //2z
    novoTri.push(triangleVertices[8]);

    //triangulo do meio
    //0x
    novoTri.push(triangleVertices[0]);
    //0y
    novoTri.push(triangleVertices[1]);
    //0z
    novoTri.push(triangleVertices[2]);

    //1x
    novoTri.push(triangleVertices[3]);
    //1y
    novoTri.push(triangleVertices[4]);
    //1z
    novoTri.push(triangleVertices[5]);

    //4x
    novoTri.push(pontoMedio[0]);
    //4y
    novoTri.push(pontoMedio[1]);
    //4z
    novoTri.push(pontoMedio[2]);

    //triangulo direito
    //1x
    novoTri.push(triangleVertices[3]);
    //1y
    novoTri.push(triangleVertices[4]);
    //1z
    novoTri.push(triangleVertices[5]);

    //2x
    novoTri.push(triangleVertices[6]);
    //2y
    novoTri.push(triangleVertices[7]);
    //2z
    novoTri.push(triangleVertices[8]);

    //4x
    novoTri.push(pontoMedio[0]);
    //4y
    novoTri.push(pontoMedio[1]);
    //4z
    novoTri.push(pontoMedio[2]);

    //insere novos vertices
    for(let i=0; i< novoTri.length; i++) {
      buffer.position.push(novoTri[i]);
    }

    var temp = buffer.indices.length - 1;
    for(let i=0; i< 3; i++) {
      buffer.indices.push(temp = temp+1);
      buffer.indices.push(temp = temp+1);
      buffer.indices.push(temp = temp+1);
    }

    console.log(buffer.indices);

    arrays_pyramid = buffer;

    arrays_pyramid.normal = calculateNormal(arrays_pyramid.position, arrays_pyramid.indices);
    arrays_pyramid.barycentric = calculateBarycentric(arrays_pyramid.position.length);
    pyramidBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_pyramid);
    pyraVAO = twgl.createVAOFromBufferInfo(gl, programInfo, pyramidBufferInfo);

    scene.children[uiObj.selectedName].drawInfo.bufferInfo = pyramidBufferInfo;
    scene.children[uiObj.selectedName].drawInfo.vertexArray = pyraVAO;

    //console.log(`ponto medio ${pontoMedio}`);
    //console.log(`indices ${triangleIndices}`);
    //console.log(`vertices ${triangleVertices}`);
  }
  