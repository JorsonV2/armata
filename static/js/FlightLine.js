function FlightLine(){

  var material = new THREE.LineBasicMaterial({ color: 0x0d910b });
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  this.flightLine = new THREE.Line(geometry, material);

  this.changeColor = function(color){
      material.color = new THREE.Color(color);
  }
}
