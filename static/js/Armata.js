function Armata(data) {
  this.id = data.id;
  this.name = data.name;
  this.lufa;
  this.x = data.x
  this.z = data.z;
  this.rotate = data.rotateArmata;
  this.rotateL = data.rotateLufa;
  this.sprite = new makeTextSprite(this.name);
  this.kula = [];
  this.kula.push(new Kula());
  this.power = 250;
  this.reload = 0.2;

  models.loadModel("mats/lufa.json", function (data) {
   console.log("model został załadowany")
   this.lufa = data;
   container.add(data) // data to obiekt kontenera zwrócony z Model.js
})

  this.rotateF = function() {
    this.obj.rotation.y = this.rotate;
    this.kulaPosition();
  }

  this.rotateLufaF = function() {
    this.lufa.rotation.z = this.rotateL;
    this.kulaPosition();
  }

  this.positionF = function() {
    this.obj.position.set(this.x, 0, this.z);
    this.kulaPosition();
  }

  this.kulaPosition = function() {
    for (var i = 0; i < this.kula.length; i++) {
      if (this.kula[i].isShot == false)
        this.kula[i].kulaPosition(this.lufa.rotation.z, this.obj.rotation.y, this.x, this.z);
    }
  }

  var container = new THREE.Object3D();

<<<<<<< HEAD
  var material = new THREE.MeshNormalMaterial({
    color: 0xff0000,
    specular: 0xffffff,
    shininess: 50,
    side: THREE.DoubleSide,
    //  map: new THREE.TextureLoader().load("wool.png"),
  })
  /*
  var geometry = new THREE.CylinderGeometry(25, 30, 200, 32);
  var lufa = new THREE.Mesh(geometry, material);
  lufa.rotateY(Math.PI / 2)
  lufa.position.y = 60;
  geometry.translate(0, 80, 0);*/



  var geometry = new THREE.CylinderGeometry(50, 50, 30, 32);
  var kolo1 = new THREE.Mesh(geometry, material)
  kolo1.rotateX(Math.PI / 2)
  kolo1.rotateZ(Math.PI / 2)
  kolo1.position.set(45, 50, 0)
=======
  var lufa = models.lufa.clone();
  lufa.scale.set(7, 7, 7);
  lufa.rotateY(Math.PI / 2)
  //lufa.rotate(Math.PI / 2)
  lufa.position.y = 40;
  this.lufa = lufa;

  var kolo1 = models.kolo.clone();
  kolo1.scale.set(15, 15, 15)
  kolo1.rotateY(Math.PI / 2)
  //kolo1.rotateZ(Math.PI ) //obrot koła
  kolo1.position.set(53, 45, 0)
>>>>>>> 7089b5749ab5b784d90c97301628e997f6a3b6bc

  var kolo2 = models.kolo.clone();
  kolo2.scale.set(15, 15, 15)
  kolo2.rotateY(Math.PI / 2)
  kolo2.position.set(-53, 45, 0)

  this.sprite.position.y = 200;
  //this.sprite.position.x = -30


  container.add(kolo1)
  container.add(kolo2)
  container.add(this.sprite);

  this.obj = container;

  this.kulaPosition();

}
