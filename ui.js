//dat GUI
var uiObj = {
   
  ['Select Object Index']: 0,
  selectedName: "",

  isObjectSelected: false,
  isAnimationPlaying: false,
  isWireframeOn: false,
  isTextureOn: false,
  destruction: false,
  objArray: [],
  verticePositionArray: [],
  selectedVertice: 0,
  indicePositionArray: [],
  selectedIndice: 0,

  animationSpeed: 2.5,

  translation: {
    x: 0.0,
    y: 0.0,
    z: 0.0,
  },
    
  rotation: {
    x: 0.0,
    y: 0.0,
    z: 0.0,

  },
    
  scale: {
    x: 1.0,
    y: 1.0,
    z: 1.0,
   },
    
  color: [0,0,0,1],

  shininess: 300,

  ['Create Pyramid']: function() {
    createObj("pyramid");
  },

  ['Create Cube']: function() {
    createObj("cube");
  },

  ['Create triangle']: function() {
    createObj("triangle");
  },

  ['Create vertice']: function() {
    createVertice(0);
  },

  ['Move X']: function() {
    moveX();
  },
  
  ['Move Y']: function() {
    moveY();
  },

  ['Move Z']: function() {
    moveZ();
  },

};

  var uiCamera = {
    x: 0,
    y: 0.0,
    z: 4.0,

    //target
    tx: 0.0,
    ty: 0.0,
    tz: 0.0,

    camerasToSelect: [0,1,2],
    selectedCamera: 0,
  }

  var luz = {
    x: 0,
    y: 0,
    z: 5,

    lightColor: [0,0,0,1],
    specularColor: [0,0,0,1],
  }

  var verticePosition = {
    x: 0,
    y: 0,
    z: 0,
  }

  var trianglePosition = {
    x: 0,
    y: 0,
    z: 0,
  }

  var gui = null;
  // Choose from named values

  function createGUI() {

    gui = new dat.gui.GUI();

    gui.add(uiObj, 'selectedName', uiObj.objArray).onChange(event => {
      selectedName = event;
      uiObj.isObjectSelected = true;

      uiObj.translation.x = nodeInfosByName[selectedName].trs.translation[0];
      uiObj.translation.y = nodeInfosByName[selectedName].trs.translation[1];
      uiObj.translation.z = nodeInfosByName[selectedName].trs.translation[2];

      uiObj.rotation.x = nodeInfosByName[selectedName].trs.rotation[0];
      uiObj.rotation.y = nodeInfosByName[selectedName].trs.rotation[1];
      uiObj.rotation.z = nodeInfosByName[selectedName].trs.rotation[2];

      uiObj.scale.x = nodeInfosByName[selectedName].trs.scale[0];
      uiObj.scale.y = nodeInfosByName[selectedName].trs.scale[1];
      uiObj.scale.z = nodeInfosByName[selectedName].trs.scale[2];
      
      gui.destroy();
      gui = null;

    });

    //gui.add(uiObj, 'isObjectSelected');
    gui.add(uiObj, 'isAnimationPlaying');
    gui.add(uiObj, 'destruction');

    gui.add(uiObj, 'isWireframeOn').onChange(event => {

      if(uiObj.isWireframeOn) {
        for(let i=0; i < scene.children.length; i++) {
          scene.children[i].drawInfo.programInfo = programInfoWireframe;
        }
      }
      else {
        for(let i=0; i < scene.children.length; i++) {
          scene.children[i].drawInfo.programInfo = programInfo;
        }
      }
      
    });

    gui.add(uiObj, 'isTextureOn').onChange(event => {

      if(uiObj.isTextureOn) {
        for(let i=0; i < scene.children.length; i++) {
          scene.children[i].drawInfo.programInfo = programInfoTexture;
        }
      }
      else {
        for(let i=0; i < scene.children.length; i++) {
          scene.children[i].drawInfo.programInfo = programInfo;
        }
      }
      
    });

    const createFolder = gui.addFolder('Create Object')
    createFolder.add(uiObj, 'Create Pyramid');
    createFolder.add(uiObj, 'Create Cube');
    createFolder.add(uiObj, 'Create triangle');

    const geometryFolder = gui.addFolder('Geometry');
    geometryFolder.closed = false;
    //geometryFolder.open();
    const moveFolder = geometryFolder.addFolder('Translation');
    moveFolder.add(uiObj.translation, 'x', -10.0, 10.0);
    moveFolder.add(uiObj.translation, 'y', -10.0, 10.0);
    moveFolder.add(uiObj.translation, 'z', -10.0, 10.0);

    const spinFolder = geometryFolder.addFolder('Rotation');
    spinFolder.add(uiObj.rotation, 'x', 0.0, 10.0);
    spinFolder.add(uiObj.rotation, 'y', 0.0, 10.0);
    spinFolder.add(uiObj.rotation, 'z', 0.0, 10.0);

    const scaleFolder = geometryFolder.addFolder('Scale');
    scaleFolder.add(uiObj.scale, 'x', -10.0, 10.0);
    scaleFolder.add(uiObj.scale, 'y', -10.0, 10.0);
    scaleFolder.add(uiObj.scale, 'z', -10.0, 10.0);

    geometryFolder.addColor(uiObj, 'color');
    geometryFolder.add(uiObj, 'animationSpeed', -5, 10);

    const cameraFolder = gui.addFolder('Camera');

    cameraFolder.add(uiCamera, 'camerasToSelect', uiCamera.camerasToSelect).onChange(event => {
      uiCamera.selectedCamera = parseInt(event);

      uiCamera.x = cameras[uiCamera.selectedCamera].cameraPosition[0];
      uiCamera.y = cameras[uiCamera.selectedCamera].cameraPosition[1];
      uiCamera.z = cameras[uiCamera.selectedCamera].cameraPosition[2];

      gui.destroy();
      gui = null;

    });

    cameraFolder.add(uiCamera, 'x', -10.0, 10.0);
    cameraFolder.add(uiCamera, 'y', -10.0, 10.0);
    cameraFolder.add(uiCamera, 'z', -10.0, 10.0);
    cameraFolder.add(uiCamera, 'tx', -10.0, 10.0);
    cameraFolder.add(uiCamera, 'ty', -10.0, 10.0);
    cameraFolder.add(uiCamera, 'tz', -10.0, 10.0);
    
    var lightfolder = gui.addFolder('Luz')
    lightfolder.add(luz, 'x', -10, 10);
    lightfolder.add(luz, 'y', -10, 10);
    lightfolder.add(luz, 'z', -15, 15);
    lightfolder.addColor(luz, 'lightColor');
    lightfolder.addColor(luz, 'specularColor');

    lightfolder.add(uiObj, 'shininess', 0, 500);

    //MOVER VERTICE

    var verticeFolder = geometryFolder.addFolder('Vertice Editor')
    uiObj.verticePositionArray = [];

    for(let i=0; i < triangleData.position.length; i+=3) {
      uiObj.verticePositionArray.push(i);
    }

    verticeFolder.add(uiObj, 'verticePositionArray', uiObj.verticePositionArray).onChange(event => {
      uiObj.selectedVertice = parseInt(event);
    });

    verticeFolder.add(verticePosition, 'x', -10, 10).onChange(event => {

      triangleData.position[uiObj.selectedVertice] = verticePosition.x;

      triangleData.normal = calculateNormal(triangleData.position, triangleData.indices);

      scene.children[uiObj.selectedName].drawInfo.bufferInfo = twgl.createBufferInfoFromArrays(gl, triangleData);
      scene.children[uiObj.selectedName].drawInfo.vertexArray = twgl.createVAOFromBufferInfo(gl, programInfo, scene.children[uiObj.selectedName].drawInfo.bufferInfo);

    });

    verticeFolder.add(verticePosition, 'y', -10, 10).onChange(event => {
      triangleData.position[uiObj.selectedVertice + 1] = verticePosition.y;

      triangleData.normal = calculateNormal(triangleData.position, triangleData.indices);

      scene.children[uiObj.selectedName].drawInfo.bufferInfo = twgl.createBufferInfoFromArrays(gl, triangleData);
      scene.children[uiObj.selectedName].drawInfo.vertexArray = twgl.createVAOFromBufferInfo(gl, programInfo, scene.children[uiObj.selectedName].drawInfo.bufferInfo);

    });

    verticeFolder.add(verticePosition, 'z', -10, 10).onChange(event => {

      triangleData.position[uiObj.selectedVertice + 2] = verticePosition.z;

      triangleData.normal = calculateNormal(triangleData.position, triangleData.indices);

      scene.children[uiObj.selectedName].drawInfo.bufferInfo = twgl.createBufferInfoFromArrays(gl, triangleData);
      scene.children[uiObj.selectedName].drawInfo.vertexArray = twgl.createVAOFromBufferInfo(gl, programInfo, scene.children[uiObj.selectedName].drawInfo.bufferInfo);

    });

    verticeFolder.add(uiObj, 'Create vertice');


    //Mover Triangulo
    var indiceFolder = geometryFolder.addFolder('Triangle Editor')

    for(let i=0; i < triangleData.indices.length; i+=3) {
      uiObj.indicePositionArray.push(i);
    }

    indiceFolder.add(uiObj, 'indicePositionArray', uiObj.indicePositionArray).onChange(event => {
      uiObj.selectedIndice = parseInt(event);
    });

    indiceFolder.add(trianglePosition, 'x', -10, 10);

    indiceFolder.add(trianglePosition, 'y', -10, 10);

    indiceFolder.add(trianglePosition, 'z', -10, 10);

    indiceFolder.add(uiObj, 'Move X');
    indiceFolder.add(uiObj, 'Move Y');
    indiceFolder.add(uiObj, 'Move Z');
    
  }

  function moveX() {
    triangleData.position[uiObj.selectedIndice * 3] += trianglePosition.x;
    triangleData.position[uiObj.selectedIndice * 3 + 3] += trianglePosition.x;
    triangleData.position[uiObj.selectedIndice * 3 + 6] += trianglePosition.x;

    triangleData.normal = calculateNormal(triangleData.position, triangleData.indices);
    scene.children[uiObj.selectedName].drawInfo.bufferInfo = twgl.createBufferInfoFromArrays(gl, triangleData);
    scene.children[uiObj.selectedName].drawInfo.vertexArray = twgl.createVAOFromBufferInfo(gl, programInfo, scene.children[uiObj.selectedName].drawInfo.bufferInfo);
  };

  function moveY() {
    triangleData.position[uiObj.selectedIndice * 3 + 1] += trianglePosition.y;
    triangleData.position[uiObj.selectedIndice * 3 + 4] += trianglePosition.y;
    triangleData.position[uiObj.selectedIndice * 3 + 7] += trianglePosition.y;

    triangleData.normal = calculateNormal(triangleData.position, triangleData.indices);
      scene.children[uiObj.selectedName].drawInfo.bufferInfo = twgl.createBufferInfoFromArrays(gl, triangleData);
      scene.children[uiObj.selectedName].drawInfo.vertexArray = twgl.createVAOFromBufferInfo(gl, programInfo, scene.children[uiObj.selectedName].drawInfo.bufferInfo);
  }

  function moveZ() {
    triangleData.position[uiObj.selectedIndice * 3 + 2] += trianglePosition.z;
    triangleData.position[uiObj.selectedIndice * 3 + 5] += trianglePosition.z;
    triangleData.position[uiObj.selectedIndice * 3 + 8] += trianglePosition.z;

    triangleData.normal = calculateNormal(triangleData.position, triangleData.indices);
    scene.children[uiObj.selectedName].drawInfo.bufferInfo = twgl.createBufferInfoFromArrays(gl, triangleData);
    scene.children[uiObj.selectedName].drawInfo.vertexArray = twgl.createVAOFromBufferInfo(gl, programInfo, scene.children[uiObj.selectedName].drawInfo.bufferInfo);
  }
