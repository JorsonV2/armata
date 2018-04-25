function Kula(player){
    this.isShot = false;
    this.target;
    this.flightLine;
    this.kulaShotPosition;
    this.armataShotPosition;
    this.armataShotAngle;
    this.shotTime = 0;
    this.added = false;

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

    this.kulaPosition = function(angle, rotation, armataPosition_x, armataPosition_z){
      this.sphere.position.z = 200 * Math.sin(angle) * Math.cos(rotation) + armataPosition_z;
      this.sphere.position.x = 200 * Math.sin(angle) * Math.sin(rotation) + armataPosition_x;
      this.sphere.position.y = 200 * Math.cos(angle) + 60;
    }

    this.setKulaShotPosition = function(){
      // pozycja_kuli = siła * czas * cotangens_kąta_pochylenia_lufy + początkowa_pozycja_kuli
      this.sphere.position.x = 150 * this.shotTime * ((this.kulaShotPosition.x - this.armataShotPosition.x) / (this.kulaShotPosition.y - this.armataShotPosition.y)) + this.kulaShotPosition.x;
      this.sphere.position.z = 150 * this.shotTime * ((this.kulaShotPosition.z - this.armataShotPosition.z) / (this.kulaShotPosition.y - this.armataShotPosition.y)) + this.kulaShotPosition.z;
      // pozycja _kuli = siła * czas * cosinus_kąta_pochylenia_lufy
      this.sphere.position.y = 150 * this.shotTime * Math.cos(this.armataShotAngle) - ((10 * this.shotTime * this.shotTime) / 2) + this.kulaShotPosition.y;
      //console.log(this.kulaShotPosition.x)
      this.shotTime += 0.15;
    }

    if(player){
      this.target = new Target();
      this.flightLine = new FlightLine();
    }
}
