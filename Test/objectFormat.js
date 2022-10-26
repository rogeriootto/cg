//Cria um objeto e adiciona no array para imprimir na tela
var objIndex = 0;
var objArray = [];

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

  objArray.push(objData);
  //console.log(objArray);
  
  objeto.children.push(newObj);

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};

  scene = makeNode(objeto);
  objIndex++;
  gui.destroy();
  gui = null;
}

function deleteObj() {

  objeto.children.pop();

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};

  scene = makeNode(objeto);
}


var arrays_pyramid = {
    position: new Float32Array([
      1, -1, 1,
      -1, -1, 1,
      -1, -1, -1,
      1, -1, -1,
      0, 1, 0,
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
      1, -1, 1, // -2 0 0, -2, 0 ,-2, 0, 0, -2
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
      1, 0, 0, 1,
      1, 0, 1, 1,
      0, 1, 1, 1,
      1, 0, 1, 1,
      1, 1, 0, 1,
      1, 0, 0, 1,
      1, 0, 1, 1,
    ]),
  };
  

  const calculateNormal = (position, indices) => {
    let pontos = []
    let faces = []
    let resultado
    
    for (let i = 0; i < position.length; i += 3) {
        pontos.push([position[i], position[i+1],position[i+2]])
    }
    
    for (let i = 0; i < indices.length; i += 3) {
        faces.push([indices[i], indices[i+1],indices[i+2]])
    }
    
    normal = faces.map(item => {
        vetorA = [pontos[item[1]][0] - pontos[item[0]][0], pontos[item[1]][1] - pontos[item[0]][1], pontos[item[1]][2] - pontos[item[0]][2]]
        vetorB = [pontos[item[2]][0] - pontos[item[0]][0], pontos[item[2]][1] - pontos[item[0]][1], pontos[item[2]][2] - pontos[item[0]][2]]
    
        produto = [
            vetorA[1] * vetorB[2] - vetorB[1] * vetorA[2],
            vetorB[0] * vetorA[2] - vetorA[0] * vetorB[2],
            vetorA[0] * vetorB[1] - vetorB[0] * vetorA[1]
        ]
    
        distancia = Math.abs(Math.sqrt(produto[0] * produto[0] + produto[1] * produto[1] + produto[2] * produto[2]))
    
        resultado = produto.map(item => item / distancia)
    
        return resultado
    })

    return normal
}