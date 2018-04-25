function Models() {

  var container = new THREE.Object3D
  var mixer


  this.loadModel = function(url, callback) {
    console.log("start");

    var material = new THREE.MeshNormalMaterial({
      color: 0xff0000,
      specular: 0xffffff,
      shininess: 50,
      side: THREE.DoubleSide,
      //  map: new THREE.TextureLoader().load("wool.png"),
    })

    var loader = new THREE.JSONLoader();

    loader.load(url, function(geometry) {

      var mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(7, 7, 7);
      mesh.position.set(0, 60, 0);

      // zwrócenie kontenera

      callback(mesh);

    });
  }
}
