function Armata(data) {
  this.id = data.id;
  this.name = data.name;
  this.lufa;
  this.lufaCenterVector;
  this.kolo1;
  this.kolo2;
  this.x = data.x
  this.z = data.z;
  this.rotate = data.rotateArmata;
  this.rotateL = data.rotateLufa;
  this.sprite = new makeTextSprite(this.name);
  this.kula = [];
  this.kula.push(new Kula());
  this.power = 100;
  this.reload = 5;

  var container = new THREE.Object3D();

  var lufa = models.lufa.clone();
  lufa.scale.set(7, 7, 7);
  lufa.rotateY(Math.PI * 0.5);
  lufa.position.y = 40;

  this.lufa = lufa;

  var kolo1 = models.kolo.clone();
  kolo1.scale.set(15, 15, 15)
  kolo1.rotateY(Math.PI / 2)
  //kolo1.rotateZ(Math.PI ) //obrot koła
  kolo1.position.set(53, 45, 0)
  this.kolo1 = kolo1;

  var kolo2 = models.kolo.clone();
  kolo2.scale.set(15, 15, 15)
  kolo2.rotateY(Math.PI / 2)
  kolo2.position.set(-53, 45, 0)
  this.kolo2 = kolo2;

  this.sprite.position.y = 200;
  //this.sprite.position.x = -30


  container.add(kolo1)
  container.add(kolo2)
  container.add(lufa)
  container.add(this.sprite);

  this.obj = container;

  this.getLufaCenter = function(){
    p = this.obj.position.clone();
    p.y = 40;
    m = new THREE.Matrix4().setPosition(p)
    n = new THREE.Matrix4().makeRotationY(this.obj.rotation.y)
    g = new THREE.Matrix4().makeRotationY(this.lufa.rotation.y)
    l = new THREE.Matrix4().makeRotationZ(this.lufa.rotation.z)
    m.multiply(n).multiply(g).multiply(l);

    this.lufaCenterVector = new THREE.Vector3(9.1, -23.1, 0);
    this.lufaCenterVector = this.lufaCenterVector.applyMatrix4(m);
  }

  this.kulaPosition = function() {
    this.getLufaCenter();
    for (var i = 0; i < this.kula.length; i++) {
      if (this.kula[i].isShot == false)
        this.kula[i].kulaPosition(this.lufa.rotation.z, this.obj.rotation.y, this.lufaCenterVector.x, this.lufaCenterVector.z, this.lufaCenterVector.y);
    }
  }

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

}
