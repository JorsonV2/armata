function Models() {
  var that = this;
  this.lufa;
  this.kolo;

  function loadModel(url, that, callback) {
    var material = new THREE.MeshNormalMaterial({
      color: 0xff0000,
      specular: 0xffffff,
      shininess: 50,
      side: THREE.DoubleSide,
    })

    var loader = new THREE.JSONLoader();

    loader.load(url, function(geometry) {
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
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
