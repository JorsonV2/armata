function Kula(owner){
    this.owner = owner;
    this.kulaShotPosition;
    this.armataShotPosition;
    this.armataShotAngle;
    this.power;
    this.shotTime = 0;
    this.added = false;
    this.path = [];
    this.bumPosition;

    var geometry = new THREE.SphereGeometry( 20, 20, 20 );
    var material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x00231f,
      shininess: 80,
      morphTargets: true,
      vertexColors: THREE.FaceColors,
      flatShading: true
    });
    this.sphere = new THREE.Mesh( geometry, material );

    this.kulaPosition = function(angle, rotation, centerPosition_x, centerPosition_z, centerPosition_y){
      this.sphere.position.z = 200 * Math.sin(angle) * Math.cos(rotation) + centerPosition_z;
      this.sphere.position.x = 200 * Math.sin(angle) * Math.sin(rotation) + centerPosition_x;
      this.sphere.position.y = 200 * Math.cos(angle) + centerPosition_y;
    }

    this.setKulaShotPosition = function(delta){
      // pozycja_kuli = siła * czas * cotangens_kąta_pochylenia_lufy + początkowa_pozycja_kuli

      this.sphere.position.x = this.power * this.shotTime * ((this.kulaShotPosition.x - this.armataShotPosition.x) / (this.kulaShotPosition.y + 40 - this.armataShotPosition.y)) + this.kulaShotPosition.x;
      this.sphere.position.z = this.power * this.shotTime * ((this.kulaShotPosition.z - this.armataShotPosition.z) / (this.kulaShotPosition.y + 40 - this.armataShotPosition.y)) + this.kulaShotPosition.z;
      // pozycja _kuli = siła * czas * cosinus_kąta_pochylenia_lufy
      this.sphere.position.y = this.power * this.shotTime * Math.cos(this.armataShotAngle) - ((10 * this.shotTime * this.shotTime) / 2) + this.kulaShotPosition.y;
      //console.log(this.kulaShotPosition.x)
      this.shotTime += delta * 15;
    }
}
