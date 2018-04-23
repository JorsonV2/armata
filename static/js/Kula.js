function Kula(){
    var geometry = new THREE.SphereGeometry( 30, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    this.sphere = new THREE.Mesh( geometry, material );

    this.kulaPosition = function(angle, rotation, armataPosition_x, armataPosition_z){
      this.sphere.position.z = 200 * Math.sin(angle) * Math.cos(rotation) + armataPosition_z;
      this.sphere.position.x = 200 * Math.sin(angle) * Math.sin(rotation) + armataPosition_x;
      this.sphere.position.y = 200 * Math.cos(angle) + 60;
    }
}
