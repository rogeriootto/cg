//dat GUI
var uiObj = {
   
  ['Select Object Index']: 0,
  selectedName: "",

  isObjectSelected: false,
  objArray: [],
    
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

  ['Create Pyramid']: function() {
    createObj("pyramid");
  },

  ['Create Cube']: function() {
    createObj("cube");
  },

  ['Create amogus']: function() {
    createObj("amongus");
  },
};

  var uiCamera = {
    x: 0,
    y: 0.0,
    z: 10.0,

    //target
    tx: 0.0,
    ty: 0.0,
    tz: 0.0
  }

  var teste = {
    x: 0,
    y: 0,
    z: -1,
  }

  var gui = null;
  // Choose from named values

  function createGUI() {

    gui = new dat.gui.GUI();

    gui.add(uiObj, 'selectedName', uiObj.objArray).onChange(event => {
      selectedName = event;

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

    gui.add(uiObj, 'isObjectSelected');

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

    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(uiCamera, 'x', -10.0, 10.0);
    cameraFolder.add(uiCamera, 'y', -10.0, 10.0);
    cameraFolder.add(uiCamera, 'z', -10.0, 10.0);
    cameraFolder.add(uiCamera, 'tx', -10.0, 10.0);
    cameraFolder.add(uiCamera, 'ty', -10.0, 10.0);
    cameraFolder.add(uiCamera, 'tz', -10.0, 10.0);
    
    const createFolder = gui.addFolder('Create Object')
    createFolder.add(uiObj, 'Create Pyramid');
    createFolder.add(uiObj, 'Create Cube');
    createFolder.add(uiObj, 'Create amogus');
    
    // gui.add(teste, 'x', -10, 10).onChange(event => {

    //   arrays_cube.position[0] = teste.x;

    //   objectsToDraw[0].bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_cube);
    //   objectsToDraw[0].vertexArray = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);

    //   //console.log()
    // });

    gui.add(teste, 'x', -100, 100);
    gui.add(teste, 'y', -100, 100);
    gui.add(teste, 'z', -100, 100);

    
  }
