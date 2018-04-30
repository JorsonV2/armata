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
        geometry.translate((0), (-3), 0)
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
      mesh.castShadow = true;
      mesh.receiveShadow = true;
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

}
