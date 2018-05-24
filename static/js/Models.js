function Models() {
  var that = this;
  this.lufa;
  this.kolo;

  function loadModel(url, that, callback) {

    var loader = new THREE.JSONLoader();

    loader.load(url, function(geometry) {
      if (url == "mats/lufa.json") {
        geometry.rotateX(Math.PI * 0.002);
        geometry.rotateZ(Math.PI * 0.002);
        geometry.translate((1.3), (-3.3), 0);
        var material = new THREE.MeshPhongMaterial({
          color: 0x000707,
          specular: 0x00231f,
          shininess: 80,
          morphTargets: true,
          vertexColors: THREE.FaceColors,
          flatShading: true
        });
      } else if (url == "mats/kolo.json") {
        geometry.translate((0), (-2.8), 0)
        var material = new THREE.MeshPhongMaterial({
          color: 0x0a1105,
          specular: 0x091600,
          shininess: 50,
          morphTargets: true,
          vertexColors: THREE.FaceColors,
          flatShading: true
        });
      }
      mesh = new THREE.Mesh(geometry, material);
      callback(mesh);
    });
  }
  /////////////////////////////////////////////////////////

  loadModel("mats/lufa.json", this, function(data) {
    that.lufa = data;
  })

  loadModel("mats/kolo.json", this, function(data) {
    that.kolo = data;
  })

  /////////////////////////////////////////////////////////
  var geometry = new THREE.SphereGeometry(30, 30, 30);
  var material1 = new THREE.MeshPhongMaterial({
    opacity: 0.3,
    transparent: true,
    shininess: 100,
    morphTargets: true,
    vertexColors: THREE.FaceColors,
    flatShading: true,
  });

  var textureLoader = new THREE.TextureLoader();
  textureLoader.load("mats/sun.jpg", function(map) {
    map.anisotropy = 8;
    material1.map = map;
    material1.needsUpdate = true;
  });

  this.bum = new THREE.Mesh(geometry, material1);

  /////////////////////////////////////////////////////////

  var grassTexture = THREE.ImageUtils.loadTexture("mats/grass-sprit.png");
  var grassMaterial = new THREE.SpriteMaterial({
    map: grassTexture,
    opacity: 0.9,
    useScreenCoordinates: true
  });
  this.grass = new THREE.Sprite(grassMaterial);
  this.grass.scale.set(60,60,60);
  this.grass.position.set(0,30,0);

  //////////////////////////////////////////////////////////////

  var trialTexture = THREE.ImageUtils.loadTexture("mats/trial.png");
  var trialMaterial = new THREE.SpriteMaterial( { map: trialTexture, opacity: 0.6, useScreenCoordinates: true} );
	this.trial = new THREE.Sprite( trialMaterial );


}
