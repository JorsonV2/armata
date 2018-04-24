function Target(){
    this.target = new THREE.Object3D();

    var geometry = new THREE.BoxGeometry(150, 10, 10);
    var material = new THREE.MeshBasicMaterial({ color: 0x0d910b });
    var cube = new THREE.Mesh(geometry, material);
    var geometry = new THREE.BoxGeometry(10, 10, 150);
    var cube2 = new THREE.Mesh(geometry, material);
    this.target.add(cube);
    this.target.add(cube2);

    this.changeColor = function(color){
        cube.material.color = new THREE.Color(color);
        cube2.material.color = new THREE.Color(color);
    }

}
