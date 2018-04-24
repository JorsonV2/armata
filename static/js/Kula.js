function Kula(){
    this.isShot = false;
    this.target;
    this.flightLine;
    this.kulaShotPosition_x;
    this.kulaShotPosition_y;
    this.kulaShotPosition_z;
    this.armataShotPosition_x;
    this.armataShotPosition_z;
    this.armataShotAngle;

    var shotTime = 0;

    var geometry = new THREE.SphereGeometry( 30, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    this.sphere = new THREE.Mesh( geometry, material );

    this.kulaPosition = function(angle, rotation, armataPosition_x, armataPosition_z){
      this.sphere.position.z = 200 * Math.sin(angle) * Math.cos(rotation) + armataPosition_z;
      this.sphere.position.x = 200 * Math.sin(angle) * Math.sin(rotation) + armataPosition_x;
      this.sphere.position.y = 200 * Math.cos(angle) + 60;
    }

    this.kulaShotPosition = function(){
      // pozycja_kuli = siła * czas * cotangens_kąta_pochylenia_lufy + początkowa_pozycja_kuli
      this.sphere.position.x = 150 * shotTime * ((kulaPosition.x - armataPosition.x) / (kulaPosition.y - armataPosition.y)) + kulaPosition.x;
      this.sphere.position.z = 150 * shotTime * ((kulaPosition.z - armataPosition.z) / (kulaPosition.y - armataPosition.y)) + kulaPosition.z;
      // pozycja _kuli = siła * czas * cosinus_kąta_pochylenia_lufy
      this.sphere.position.y = 150 * shotTime * Math.cos(alpha) - ((10 * shotTime * shotTime) / 2) + kulaPosition.y;
    }
}
