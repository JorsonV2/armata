function Armata(data) {
  this.id = data.id;
  this.name = data.name;
  this.lufa;
  this.x = data.x
  this.z = data.z;
  this.rotate = data.rotateArmata;
  this.rotateL = data.rotateLufa;
  this.sprite = new makeTextSprite(this.name);

  this.rotateF = function () {
    this.obj.rotation.y = this.rotate;
  }

  this.rotateLufaF = function () {
    this.lufa.rotation.z = this.rotateL;
  }

  this.positionF = function () {
    this.obj.position.set(this.x, 0, this.z);
  }

  //  this.color = color;

  var container = new THREE.Object3D();

  var material = new THREE.MeshNormalMaterial({
    color: 0xff0000,
    specular: 0xffffff,
    shininess: 50,
    side: THREE.DoubleSide,
    //  map: new THREE.TextureLoader().load("wool.png"),
  })

  var geometry = new THREE.CylinderGeometry(25, 30, 200, 32);
  geometry.translate(0, 80, 0);
  var lufa = new THREE.Mesh(geometry, material);
  lufa.rotateY(Math.PI / 2)
  lufa.position.set(0, 60, 0);
  this.lufa = lufa;

  // var loader = new THREE.JSONLoader();
  // loader.load('mats/lufa.json', function(geometry) {
  //   var mesh = new THREE.Mesh(geometry, material);
  //   mesh.scale.set(10, 10, 10);
  //   mesh.position.set(0, 60, 0);
  //   console.log(that);
  //   that.lufa = mesh;
  //   container.add(mesh);
  //
  // });

  var geometry = new THREE.CylinderGeometry(50, 50, 30, 32);
  var kolo1 = new THREE.Mesh(geometry, material)
  kolo1.rotateX(Math.PI / 2)
  kolo1.rotateZ(Math.PI / 2)
  kolo1.position.set(45, 50, 0)

  var geometry = new THREE.CylinderGeometry(50, 50, 30, 32);
  var kolo2 = new THREE.Mesh(geometry, material)
  kolo2.rotateX(Math.PI / 2)
  kolo2.rotateZ(Math.PI / 2)
  kolo2.position.set(-45, 50, 0)

  this.sprite.position.y = 200;
  //this.sprite.position.x = -30

  container.add(kolo1)
  container.add(kolo2)
  container.add(lufa);
  container.add(this.sprite);

  console.log(this.sprite.position)


  this.obj = container;

}
