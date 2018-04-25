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
<<<<<<< HEAD
  this.kula.push(new Kula());
  this.power = 250;
  this.reload = 0.2;
=======
  this.kula.push(new Kula(player));
  this.power = 150;
  this.reload = 5;
>>>>>>> 88d9d3876d80bbdb23e93f93da21a082e71e977d

  this.rotateF = function () {
    this.obj.rotation.y = this.rotate;
    //console.log(this.rotate)
    this.kulaPosition();
  }

  this.rotateLufaF = function () {
    this.lufa.rotation.z = this.rotateL;
    this.kulaPosition();
  }

  this.positionF = function () {
    this.obj.position.set(this.x, 0, this.z);
    this.kulaPosition();
  }

  this.kulaPosition = function(){
    for(var i = 0; i < this.kula.length; i++){
      if(this.kula[i].isShot == false)
        this.kula[i].kulaPosition(this.lufa.rotation.z, this.obj.rotation.y, this.x, this.z);
    }
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
  var lufa = new THREE.Mesh(geometry, material);
  lufa.rotateY(Math.PI / 2)
  lufa.position.y = 60;
  geometry.translate(0, 80, 0);
  this.lufa = lufa;

  models.loadModel("mats/lufa.json", function (data) {
   console.log("model został załadowany")
   //this.lufa = lufa;
   container.add(data) // data to obiekt kontenera zwrócony z Model.js
})

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
  console.log(this.lufa.rotation.x)

  this.kulaPosition();

}
