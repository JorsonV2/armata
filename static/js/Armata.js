function Armata(data, player) {
  this.id = data.id;
  this.name = data.name;
  this.lufa;
  this.x = data.x
  this.z = data.z;
  this.rotate = data.rotateArmata;
  this.rotateL = data.rotateLufa;
  this.sprite = new makeTextSprite(this.name);
  this.kula = [];
  this.kula.push(new Kula(player));
  this.power = 150;
  this.reload = 5;

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

  var kolo2 = models.kolo.clone();
  kolo2.scale.set(15, 15, 15)
  kolo2.rotateY(Math.PI / 2)
  kolo2.position.set(-53, 45, 0)

  this.sprite.position.y = 200;
  //this.sprite.position.x = -30


  container.add(kolo1)
  container.add(kolo2)
  container.add(lufa);
  container.add(this.sprite);

  this.obj = container;

  this.kulaPosition();

}
