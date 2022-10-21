//dat GUI
var uiObj = {
   
  ['Select Object Index']: 0,
  selectedName: "",
    
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
};

  var uiCamera = {
    x: -10.0,
    y: 0.0,
    z: 0.0,

    //target
    tx: 0.0,
    ty: 0.0,
    tz: 0.0
  }
  

  var gui = null;
  // Choose from named values

  function createGUI() {

    gui = new dat.gui.GUI();

    const geometryFolder = gui.addFolder('Geometry');
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
    
    const select = gui.add(uiObj, 'Select Object Index');
    
  }
