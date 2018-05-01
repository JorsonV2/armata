function Bum(x, z) {
  this.container = new THREE.Object3D();

  this.scale = 1;
  this.bumOBJ = models.bum.clone();

  //this.light = new THREE.PointLight( 0xff0040, 2000, 5000 );

  this.container.position.x = x;
  this.container.position.z = z;

  this.container.add(this.bumOBJ);
  //this.container.add(this.light);
}
