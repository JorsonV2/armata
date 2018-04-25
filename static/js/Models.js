function Models() {
  var that = this;
  this.lufa;
  this.kolo;

  function loadModel(url, that, callback) {

    var loader = new THREE.JSONLoader();

    loader.load(url, function(geometry) {
      if (url == "mats/lufa.json") {
        geometry.translate((1.3), (-3.3), 0)
        var material = new THREE.MeshNormalMaterial({
          // // light
          // specular: '#ffffff',
          // // intermediate
          // color: '#000000',
          // // dark
          // emissive: '#333333',
          // shininess: 100
        });
      } else if (url == "mats/kolo.json") {
        geometry.translate((0), (-3), 0)
        var material = new THREE.MeshNormalMaterial({
          // map: THREE.ImageUtils.loadTexture("mats/drewno.jpg"),
          // shininess: 50,
          // side: THREE.DoubleSide,
          //  morphTargets: true // odpowiada za animację materiału modelu
        });
      }
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
