cameraRotation = -Math.PI * 0.75;

function Game() {
  var MyPlayer;
  var Players = [];
  var Nicks = [];
  var MyPlayer;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);

  var init = function() {

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    $('#start').remove();
    $('<div id="root"></div>').appendTo('body');
    $("#root").append(renderer.domElement);

    // podłoga
    var plane = new THREE.PlaneGeometry(10000, 10000, 100, 100)
    var material = new THREE.MeshBasicMaterial({
      color: 0x8888ff,
      side: THREE.DoubleSide,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });

    var pl = new THREE.Mesh(plane, material);
    pl.rotateX(Math.PI / 2);

    // Bardzo dziwne gowno #stefan kazał
    scene.add(pl);
    var clock = new THREE.Clock();
    let axes = new THREE.AxesHelper(1000);
    scene.add(axes);
    renderer.setClearColor(0xffffff);
    scene.castShadow = true
    ////////////

    //------- Poruszanie kamerą oraz celownikiem --------------

    var material = new THREE.LineBasicMaterial({ color: 0x0d910b });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var line = new THREE.Line(geometry, material);
    // var material = new THREE.LineBasicMaterial({ color: 0x930000 });
    // var line2 = new THREE.Line(geometry, material);
    // scene.add(line2);
    scene.add(line);

    var target = new Target();
    scene.add(target.target);

    //////////////////////////////////////////////////////////////////////////////////////////

    function render() {
      var delta = clock.getDelta();

      if (MyPlayer) {
        camera.position.z = 450 * Math.cos(cameraRotation) + MyPlayer.obj.position.z;
        camera.position.x = 450 * Math.sin(cameraRotation) + MyPlayer.obj.position.x;
        camera.position.y = 300;
<<<<<<< HEAD

=======
>>>>>>> a6d1142ebaf6fb11de7972e19eca291441108e08

        angle = MyPlayer.lufa.rotation.z;
        rotation = MyPlayer.obj.rotation.y;


        curveTime = 0;
        curvePath = [];
        curveVector = new THREE.Vector3(
            200 * Math.sin(angle) * Math.sin(rotation) + MyPlayer.obj.position.x,
            200 * Math.cos(angle) + 60,
            200 * Math.sin(angle) * Math.cos(rotation) + MyPlayer.obj.position.z
        );

        while (curveVector.y > 0) {
            curvePath.push(curveVector);
            curveTime += 0.05;
            curveVector = new THREE.Vector3(0, 0, 0);
            curveVector.x = 150 * curveTime * ((curvePath[0].x - MyPlayer.obj.position.x) / (curvePath[0].y - MyPlayer.obj.position.y)) + curvePath[0].x;
            curveVector.z = 150 * curveTime * ((curvePath[0].z - MyPlayer.obj.position.z) / (curvePath[0].y - MyPlayer.obj.position.y)) + curvePath[0].z;
            curveVector.y = 150 * curveTime * Math.cos(angle) - ((10 * curveTime * curveTime) / 2) + curvePath[0].y;
        }

        curve = new THREE.CatmullRomCurve3(curvePath);
        points = curve.getPoints(curvePath.length - 1);
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        line.geometry = geometry;

        target.target.position.z = curvePath[curvePath.length - 1].z//Math.cos(rotation) * (Math.pow(150, 2) * Math.sin(2 * angle) / 10) + MyPlayer.kula.sphere.position.z;
        target.target.position.x = curvePath[curvePath.length - 1].x;
<<<<<<< HEAD
        camera.lookAt(target.target.position);
=======

        camera.lookAt(target.target.position);
      }

      for(var i = 0 ; i < Players.length; i++){
        if(Players[i].id == MyPlayer.id){
          
        }
>>>>>>> a6d1142ebaf6fb11de7972e19eca291441108e08
      }

      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // if (net) {
      //   for (var i = 0; i < Players.length; i++) {
      //     if ((Players[i].id) == (net.id())) {
      //       camera.position.x = Players[i].obj.position.x + 300
      //       camera.position.z = Players[i].obj.position.z
      //       camera.position.y = Players[i].obj.position.y + 500
      //       camera.lookAt(Players[i].obj.position)
      //       //camera.rotation.y = (Math.PI / 2);
      //     }
      //   }
      // }

      //------- Akcje dla klikniętych klawiszy --------------

      if (ui.map[87]) { // przód: w
        var move = {
          move: "w",
          Direction_x: (MyPlayer.obj.getWorldDirection().x),
          Direction_z: (MyPlayer.obj.getWorldDirection().z)
        }
        net.send(move);
        MyPlayer.x += 10 * MyPlayer.obj.getWorldDirection().x
        MyPlayer.z += 10 * MyPlayer.obj.getWorldDirection().z
        MyPlayer.positionF();
      }
      if (ui.map[83]) { // tył: s
        var move = {
          move: "s",
          Direction_x: (MyPlayer.obj.getWorldDirection().x),
          Direction_z: (MyPlayer.obj.getWorldDirection().z)
        }
        net.send(move);
        MyPlayer.x -= 10 * MyPlayer.obj.getWorldDirection().x
        MyPlayer.z -= 10 * MyPlayer.obj.getWorldDirection().z
        MyPlayer.positionF();
      }
      if (ui.map[65]) { // obrót kamery w lewo: a
            cameraRotation -= 0.02;
            cameraRotation = Math.max(MyPlayer.obj.rotation.y - Math.PI * 1.25, Math.min(MyPlayer.obj.rotation.y - Math.PI * 0.75, cameraRotation));
      }
      if (ui.map[68]) { // obrót kamery w prawo: d
            cameraRotation += 0.02;
            cameraRotation = Math.max(MyPlayer.obj.rotation.y - Math.PI * 1.25, Math.min(MyPlayer.obj.rotation.y - Math.PI * 0.75, cameraRotation));
      }
      if (ui.map[32]) { // strzał: spacja
        // shot = true;
        // startShot();
      }


      requestAnimationFrame(render);





      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      renderer.render(scene, camera);
    }
    render();
  }
  init();

  this.returnMyPlayer = function() {
    return MyPlayer;
  }
  this.removePlayer = function(id) {
    for (var i = 0; i < Players.length; i++) {
      if ((Players[i].id) == (id)) {
        scene.remove(Players[i].obj)
        scene.remove(Players[i].kula.sphere);
        Players.splice(i, 1);
<<<<<<< HEAD

=======
>>>>>>> a6d1142ebaf6fb11de7972e19eca291441108e08
      }
    }
    MyPlayerUpdate();
  }

  this.createPlayer = function(data) {
    if (Players.length == 0) {
      for (var i = 0; i < data.length; i++) {
        Players[i] = new Armata(data[i]);
        scene.add((Players[i].obj));
        scene.add(Players[i].kula[0].sphere)
        Players[i].kula[0].target = new Target();
        Players[i].kula[0].flightLine = new FlightLine();
        Players[i].positionF();
        Players[i].rotateF();
        Players[i].rotateLufaF();
      }
    } else {
      for (var i = 0; i < data.length; i++) {
        for (var x = 0; x < Players.length; x++) {
          if (data[i].id == Players[x].id) {
            break;
          } else if ((x + 1) == Players.length) {
            Players[i] = new Armata(data[i]);
            scene.add((Players[i].obj));
            scene.add(Players[i].kula[0].sphere)
            Players[i].positionF();
            Players[i].rotateF();
            Players[i].rotateLufaF();
          }
        }
      }
    }
    //update gracza
    MyPlayerUpdate();
  }

  this.movePlayer = function(data) {
    for (var i = 0; i < Players.length; i++) {
      if ((Players[i].id) == (data.id)) {
        pl = Players[i];
        if (data.rotateOBJ) {
          pl.rotate = data.rotateOBJ;
          pl.rotateF();
        } else if (data.rotateL) {
          pl.rotateL = data.rotateL;
          pl.rotateLufaF();
        } else if (data.move == "w") {
          pl.x = data.x;
          pl.z = data.z;
          pl.positionF();
        } else if (data.move == "s") {
          pl.x = data.x;
          pl.z = data.z;
          pl.positionF();
        }
      }
    }

  }

  function MyPlayerUpdate() {
    for (var i = 0; i < Players.length; i++) {
      var id = net.id();
      if ((Players[i].id) == (id)) {
        MyPlayer = Players[i];
        Players[i].obj.remove(Players[i].sprite)
      }
    }
  }
}
