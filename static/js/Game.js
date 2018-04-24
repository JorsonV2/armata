cameraRotation = Math.PI;

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

    function render() {
      var delta = clock.getDelta();

      if (MyPlayer) {
        camera.position.z = 800 * Math.cos(cameraRotation) + MyPlayer.obj.position.z;
        camera.position.x = 800 * Math.sin(cameraRotation) + MyPlayer.obj.position.x;
        camera.position.y = 300;
        camera.lookAt(MyPlayer.obj.position);
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

      }
      if (ui.map[68]) { // obrót kamery w prawo: d
        // cameraRotation += 0.02;
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
        Players.splice(i, 1);
        for (var j = 0; j < Nicks.length; j++) {
          if (Players[i].id == Nicks[j].id) {
            Nicks[j].sprite.position.x = Players[i].obj.position.x;
            Nicks[j].sprite.position.z = Players[i].obj.position.z;
          }
        }
      }
    }
    MyPlayerUpdate();
  }

  this.createPlayer = function(data) {
    if (Players.length == 0) {
      for (var i = 0; i < data.length; i++) {
        Players[i] = new Armata(data[i]);
        scene.add((Players[i].obj));
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
      }
    }
  }
}
