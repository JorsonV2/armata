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
    var target = new Target();
    var flightLine = new FlightLine();
    scene.add(target.target);
    scene.add(flightLine.flightLine);

    //////////////////////////////////////////////////////////////////////////////////////////

    function render() {
      var delta = clock.getDelta();

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
      if (ui.map[32]) {
        for(var i = 0; i < MyPlayer.kula.length; i++){
          if(MyPlayer.kula[i].shotTime == 0){
            MyPlayer.kula[i].isShot = true;
            scene.add(MyPlayer.kula[i].target.target);
            scene.add(MyPlayer.kula[i].flightLine.flightLine);
            MyPlayer.kula[i].kulaShotPosition = MyPlayer.kula[i].sphere.position.clone();
            MyPlayer.kula[i].armataShotPosition = MyPlayer.obj.position.clone();
            MyPlayer.kula[i].armataShotAngle = MyPlayer.lufa.rotation.z;
          }
        }
      }

      // -------------- Kamera, tor lotu oraz lot kuli ---------------------------------

      if (MyPlayer) {
        // Ogracanie kamery podczas obracania playera
        camera.position.z = 450 * Math.cos(cameraRotation) + MyPlayer.obj.position.z;
        camera.position.x = 450 * Math.sin(cameraRotation) + MyPlayer.obj.position.x;
        camera.position.y = 300;


        angle = MyPlayer.lufa.rotation.z;
        rotation = MyPlayer.obj.rotation.y;

        //------------------------ Tor lotu niewystrzelonej kuli --------------------------
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
            curveVector.x = MyPlayer.power * curveTime * ((curvePath[0].x - MyPlayer.obj.position.x) / (curvePath[0].y - MyPlayer.obj.position.y)) + curvePath[0].x;
            curveVector.z = MyPlayer.power * curveTime * ((curvePath[0].z - MyPlayer.obj.position.z) / (curvePath[0].y - MyPlayer.obj.position.y)) + curvePath[0].z;
            curveVector.y = MyPlayer.power * curveTime * Math.cos(angle) - ((10 * curveTime * curveTime) / 2) + curvePath[0].y;
        }

        curve = new THREE.CatmullRomCurve3(curvePath);
        points = curve.getPoints(curvePath.length - 1);
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        flightLine.flightLine.geometry = geometry;

        target.target.position.z = curvePath[curvePath.length - 1].z//Math.cos(rotation) * (Math.pow(150, 2) * Math.sin(2 * angle) / 10) + MyPlayer.kula.sphere.position.z;
        target.target.position.x = curvePath[curvePath.length - 1].x;

        camera.lookAt(target.target.position);
        //----------------------------------------------------------------------

      }

      for(var i = 0 ; i < Players.length; i++){ // Wykonywane dla wszystkich playerów
        if(Players[i].id == MyPlayer.id){ // wykonywane dla gracza
          for(var j = 0; j < MyPlayer.kula.length; j++){// wykonywane gla wszystkich kul
            if(MyPlayer.kula[j].isShot){// jeżeli została wystrzelona

              MyPlayer.kula[j].setKulaShotPosition();//ustalenie jej pozycji

              if(MyPlayer.kula[j].sphere.position.y > 0){
                if(MyPlayer.kula[j].shotTime > MyPlayer.reload && Players[i].kula[j].added == false){ // jeżeli leci dłużej niż x ładuje się 2
                  kula = new Kula(true);
                  MyPlayer.kula.push(kula);
                  MyPlayer.kulaPosition();
                  scene.add(MyPlayer.kula[MyPlayer.kula.length - 1].sphere)
                  MyPlayer.kula[j].added = true;
                }

                //------------- Tor lotu lecącej kuli -------------------------------

                curveTime = MyPlayer.kula[j].shotTime;
                curvePath = [];
                curveVector = MyPlayer.kula[j].sphere.position.clone();

                while (curveVector.y > 0) {
                    curvePath.push(curveVector);
                    curveTime += 0.1;
                    curveVector = new THREE.Vector3(0, 0, 0);
                    curveVector.x = MyPlayer.power * curveTime * ((MyPlayer.kula[j].kulaShotPosition.x - MyPlayer.kula[j].armataShotPosition.x) / (MyPlayer.kula[j].kulaShotPosition.y - MyPlayer.kula[j].armataShotPosition.y)) + MyPlayer.kula[j].kulaShotPosition.x;
                    curveVector.z = MyPlayer.power * curveTime * ((MyPlayer.kula[j].kulaShotPosition.z - MyPlayer.kula[j].armataShotPosition.z) / (MyPlayer.kula[j].kulaShotPosition.y - MyPlayer.kula[j].armataShotPosition.y)) + MyPlayer.kula[j].kulaShotPosition.z;
                    curveVector.y = MyPlayer.power * curveTime * Math.cos(MyPlayer.kula[j].armataShotAngle) - ((10 * curveTime * curveTime) / 2) + MyPlayer.kula[j].kulaShotPosition.y;
                    //console.log(curveVector)
                }
                if(curvePath.length > 1){
                  curve = new THREE.CatmullRomCurve3(curvePath);
                  points = curve.getPoints(curvePath.length - 1);
                  geometry = new THREE.BufferGeometry().setFromPoints(points);
                  MyPlayer.kula[j].flightLine.flightLine.geometry = geometry;
                  //console.log(curvePath)
                }

                MyPlayer.kula[j].target.target.position.z = curvePath[curvePath.length - 1].z//Math.cos(rotation) * (Math.pow(150, 2) * Math.sin(2 * angle) / 10) + MyPlayer.kula.sphere.position.z;
                MyPlayer.kula[j].target.target.position.x = curvePath[curvePath.length - 1].x;

                //console.log(Players[i].kula[j].sphere.position.y, curvePath[curvePath.length - 1].y)

                //console.log(Players[i].kula[j].kulaShotPosition)

                //------------------------------------------------------

              }

              // ------------------ Usuwanie kuli która spadła ---------------------------

              if(Players[i].kula[j].sphere.position.y < 0){
                scene.remove(MyPlayer.kula[j].target.target);
                scene.remove(MyPlayer.kula[j].flightLine.flightLine);
                scene.remove(MyPlayer.kula[j].sphere);
                MyPlayer.kula.splice(j, 1);
                //console.log(Players[i].kula)
              }
            }
          }
        }
        else{// wykonuje się dla wszyskich playerów oprucz gracza
          for(var j = 0; j < Players[i].kula.length; j++){
            if(Players[i].kula[j].isShot == true){
              Players[i].kula[j].setKulaShotPosition();
              if(Players[i].kula[j].shotTime > 3 && Players[i].kula[j].added == false){
                kula = new Kula(true);
                Players[i].kula.push(kula);
                Players[i].kula[j].added = true;
              }
            }
          }
        }
        if(Players[i].kula.length == 0){
          Players[i].kula.push(new Kula(true));
          Players[i].kulaPosition();
          scene.add(Players[i].kula[0].sphere)
          //console.log(Players[i].kula)
        }
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
        for(var j = 0; j < Players[i].kula.length; j++){
          scene.remove(Players[i].kula[j].sphere);
        }
        Players.splice(i, 1);
      }
    }
    MyPlayerUpdate();
  }

  this.createPlayer = function(data) {
    if (Players.length == 0) {
      for (var i = 0; i < data.length; i++) {
        Players[i] = new Armata(data[i], true);
        scene.add((Players[i].obj));
        scene.add(Players[i].kula[0].sphere)
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
            Players[i] = new Armata(data[i], false);
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
