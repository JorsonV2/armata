cameraRotation = -Math.PI * 0.20;

function Game() {
  var that = this;
  var recoilPlayers = [];
  var MyPlayer;
  var Players = [];
  var Nicks = [];
  var allBum = [];
  var shotKule = [];
  var MyPlayer;
  var scene = new THREE.Scene();
  //scene.fog = new THREE.FogExp2( 0xefd1b5, 0.00025 );
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50000);

  target = new Target();
  var flightLine = new FlightLine();
  scene.add(target.target);
  scene.add(flightLine.flightLine);

  this.round = function(n, k) {
    var factor = Math.pow(10, k);
    return Math.round(n * factor) / factor;
  }

  var init = function() {
    window.addEventListener('resize', function() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    renderer = new THREE.WebGLRenderer({
      //antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    $('#start').css("display", "none");
    $('<div id="root"></div>').appendTo('body');
    $("#root").append(renderer.domElement);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    //renderer.shadowMap.enabled = true;
    //skybox

    var imagePrefix = "mats/dawnmountain-";
    var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var imageSuffix = ".png";

    var materialArray = [];
    for (var i = 0; i < 6; i++)
      materialArray.push(new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
        side: THREE.BackSide
      }));

    var skyGeometry = new THREE.CubeGeometry(50000, 50000, 50000);
    var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    //skyBox.rotation.x += Math.PI / 2;
    scene.add(skyBox);

    // podłoga

    var floorTexture = new THREE.ImageUtils.loadTexture('mats/grass3.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(150, 150);
    var floorMaterial = new THREE.MeshPhongMaterial({
      shininess: 1000,
      map: floorTexture,
      side: THREE.DoubleSide
    });
    var floorGeometry = new THREE.PlaneGeometry(50000, 50000, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    var clock = new THREE.Clock();
    let axes = new THREE.AxesHelper(1000);
    scene.add(axes);
    ////////////

    //------- Poruszanie kamerą oraz celownikiem --------------

    //////////////////////////////////////////////////////////////////////////////////////////
    //test swiatł

    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);

    var dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(-100, 200, 100);
    dirLight.position.multiplyScalar(30);
    scene.add(dirLight);

    var isShaking = false;
    var shakingTime = 2;

    //////////////////////////////////////////////////////////////////

    for (var i = 0; i < 5000; i++) {
      var grass = models.grass.clone();
      grass.position.x = Math.floor(Math.random() * (50000 + 1) - 25000);
      grass.position.z = Math.floor(Math.random() * (50000 + 1) - 25000);
      scene.add(grass)
    }

    function render() {
      var delta = clock.getDelta();



      // -------------- Kamera, tor lotu oraz lot kuli ---------------------------------
      //siema

      if (MyPlayer) {

        if(MyPlayer.recoilTime > 0){
          MyPlayer.obj.position.x -= MyPlayer.speed * MyPlayer.recoilTime * delta * MyPlayer.obj.getWorldDirection().x;
          MyPlayer.obj.position.z -= MyPlayer.speed * MyPlayer.recoilTime * delta * MyPlayer.obj.getWorldDirection().z;
          MyPlayer.recoilTime -= delta * 5;
          MyPlayer.kulaPosition();

          var move = {
            m: "r",
            x: (MyPlayer.obj.getWorldDirection().x * delta * MyPlayer.recoilTime),
            z: (MyPlayer.obj.getWorldDirection().z * delta * MyPlayer.recoilTime)
          }

          net.movePlayer(move);
        }


        //------- Akcje dla klikniętych klawiszy --------------

        if (ui.map[87] && MyPlayer.recoilTime <= 0) { // przód: w

          MyPlayer.kolo1.rotation.z += 0.1;
          MyPlayer.kolo2.rotation.z += 0.1;

          MyPlayer.obj.position.x += (MyPlayer.speed + (20 * MyPlayer.skillSpeed)) * delta * MyPlayer.obj.getWorldDirection().x;
          MyPlayer.obj.position.z += (MyPlayer.speed + (20 * MyPlayer.skillSpeed)) * delta * MyPlayer.obj.getWorldDirection().z;
          MyPlayer.kulaPosition();

          var move = {
            m: "w",
            x: (MyPlayer.obj.getWorldDirection().x * delta),
            z: (MyPlayer.obj.getWorldDirection().z * delta)
          }

          net.movePlayer(move);
          //  imove.push(move);
        }
        if (ui.map[83] && MyPlayer.recoilTime <= 0) { // tył: s

          MyPlayer.kolo1.rotation.z -= 0.1;
          MyPlayer.kolo2.rotation.z -= 0.1;
          MyPlayer.obj.position.x -= (MyPlayer.speed + (20 * MyPlayer.skillSpeed)) * delta * MyPlayer.obj.getWorldDirection().x;
          MyPlayer.obj.position.z -= (MyPlayer.speed + (20 * MyPlayer.skillSpeed)) * delta * MyPlayer.obj.getWorldDirection().z;
          MyPlayer.kulaPosition();

          var move = {
            m: "s",
            x: (MyPlayer.obj.getWorldDirection().x * delta),
            z: (MyPlayer.obj.getWorldDirection().z * delta)
          }

          net.movePlayer(move);
          //imove.push(move);

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
          if (MyPlayer.kula) {
            var rot = MyPlayer.obj.rotation.y
            var rotL = MyPlayer.lufa.rotation.z
            var move = {
              o: rot,
              l: rotL,
            }
            net.shotPlayer(move);

            isShaking = true;
            that.shotKula(MyPlayer.id);
          }

        }

        // Ogracanie kamery podczas obracania playera
        camera.position.z = 600 * Math.cos(cameraRotation) + MyPlayer.obj.position.z;
        camera.position.x = 600 * Math.sin(cameraRotation) + MyPlayer.obj.position.x;
        camera.position.y = 300;

        if (isShaking) {
          camera.position.z += Math.random() * 50 - 25;
          camera.position.x += Math.random() * 50 - 25;
          camera.position.y += Math.random() * 50 - 25;
          shakingTime -= 0.15;
          if (shakingTime < 0) {
            isShaking = false;
            shakingTime = 2;
          }
        }


        angle = MyPlayer.lufa.rotation.z;
        rotation = MyPlayer.obj.rotation.y;

        //------------------------ Tor lotu niewystrzelonej kuli --------------------------
        curveTime = 0;
        curvePath = [];
        curveVector = new THREE.Vector3(
          200 * Math.sin(angle) * Math.sin(rotation) + MyPlayer.lufaCenterVector.x,
          200 * Math.cos(angle) + MyPlayer.lufaCenterVector.y,
          200 * Math.sin(angle) * Math.cos(rotation) + MyPlayer.lufaCenterVector.z
        );

        power = MyPlayer.power;
        if (angle < 0.95) power = MyPlayer.power * (angle + 0.05);

        while (curveVector.y > 0) {
          curvePath.push(curveVector);
          curveTime += 0.05;
          curveVector = new THREE.Vector3(0, 0, 0);
          curveVector.x = power * curveTime * ((curvePath[0].x - MyPlayer.lufaCenterVector.x) / (curvePath[0].y + 40 - MyPlayer.lufaCenterVector.y)) + curvePath[0].x;
          curveVector.z = power * curveTime * ((curvePath[0].z - MyPlayer.lufaCenterVector.z) / (curvePath[0].y + 40 - MyPlayer.lufaCenterVector.y)) + curvePath[0].z;
          curveVector.y = power * curveTime * Math.cos(angle) - ((10 * curveTime * curveTime) / 2) + curvePath[0].y;
        }

        curve = new THREE.CatmullRomCurve3(curvePath);
        points = curve.getPoints(curvePath.length - 1);
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        flightLine.flightLine.geometry = geometry;

        target.target.position.z = curvePath[curvePath.length - 1].z; //Math.cos(rotation) * (Math.pow(150, 2) * Math.sin(2 * angle) / 10) + MyPlayer.kula.sphere.position.z;
        target.target.position.x = curvePath[curvePath.length - 1].x;

        camera.lookAt(target.target.position);
        //camera.lookAt(MyPlayer.kula[0].sphere.position);
        //camera.lookAt(MyPlayer.obj.position);
        //----------------------------------------------------------------------
      }


      //////////////////// Wykonywane na wystrzelonych kulach ///////////////////////////
      for (var i = 0; i < shotKule.length; i++) {

        var kula = shotKule[i];

        kula.setKulaShotPosition(delta);

        ////////////////  Ścierzka za pociskiem ////////////////////////////////////

        if (kula.shotTime % 0.6 < 0.6 && kula.shotTime % 0.6 > 0.45) {
          var sprite = models.trial.clone();
          sprite.position.set(kula.sphere.position.x, kula.sphere.position.y, kula.sphere.position.z)
          scene.add(sprite);
          kula.path.push(sprite)

          if (kula.path.length > 8) {
            scene.remove(kula.path.shift());
          }

          for (var z = 0; z < kula.path.length; z++) {
            kula.path[z].scale.set(2 * (z + 10), 2 * (z + 10), 1);
          }
        }

        /////////////////  Dodanie nowej kuli: reload ///////////////////////////////////

        if (kula.sphere.position.y > 0) {
          if (kula.shotTime > kula.owner.reload && !kula.added) { // jeżeli leci dłużej niż x ładuje się 2
            kula.owner.kula = new Kula(kula.owner);
            kula.owner.kulaPosition();
            scene.add(kula.owner.kula.sphere)
            kula.added = true;
          }
        }

        /////////////// Usinięcie kuli, dodanie nowej, dodanie wybuchu ///////////////////////


        if (kula.sphere.position.y < 0 && MyPlayer) {
          if(kula.owner.id == MyPlayer.id){
            var bum = {
              x: kula.bumPosition.x,
              z: kula.bumPosition.z
            }
            net.bum(bum);
          }

          if (!kula.added) {

            kula.owner.kula = new Kula(kula.owner);
            kula.owner.kulaPosition();
            scene.add(kula.owner.kula.sphere);
          }

          var bum = new Bum((kula.sphere.position.x), (kula.sphere.position.z));
          allBum.push(bum);
          scene.add(bum.container);

          scene.remove(kula.sphere);
          for (var z = 0; z < kula.path.length; z++) {
            scene.remove(kula.path[z])
          }

          shotKule.splice(i, 1);

        }

        //////////////////////////////////////////////////////////////////////////
      }

      if (allBum.length > 0) {
        for (var i = 0; i < allBum.length; i++) {
          var s = allBum[i].scale;
          allBum[i].scale += 2;
          allBum[i].bumOBJ.scale.set(s, s, s);
          if ((allBum[i].scale) > 25) {
            scene.remove((allBum[i].container))
            allBum.splice(i, 1);
          }
        }
      }

      requestAnimationFrame(render);

      renderer.render(scene, camera);

    }
    render();
  }
  init();

  //kontrola wysyłania poruszania się na serwer
  // setInterval(function() {
  //   if ((imove.length != 0)) {
  //     net.movePlayer(imove[imove.length - 1]);
  //     imove = [];
  //   }
  // }, 100);

  this.shotKula = function(id) {
    for (var i = 0; i < Players.length; i++) {
      if (Players[i].id == id) {
        power = Players[i].power;
        if (Players[i].lufa.rotation.z < 0.95) power = Players[i].power * (Players[i].lufa.rotation.z + 0.05);
        Players[i].kula.bumPosition = target.target.position.clone();
        Players[i].kula.power = power;
        Players[i].kula.kulaShotPosition = Players[i].kula.sphere.position.clone();
        Players[i].kula.armataShotPosition = Players[i].lufaCenterVector.clone();
        Players[i].kula.armataShotAngle = Players[i].lufa.rotation.z;
        shotKule.push(Players[i].kula);
        Players[i].kula = null;
        if(id == MyPlayer.id){
          MyPlayer.recoilTime = 3;
        }
      }
    }
  }

  this.returnMyPlayer = function() {
    return MyPlayer;
  }
  this.removePlayer = function(id) {
    for (var i = 0; i < Players.length; i++) {
      if ((Players[i].id) == (id)) {

          scene.remove(Players[i].obj)
          scene.remove(Players[i].kula.sphere);
          Players.splice(i, 1);

          if(id == MyPlayer.id)
            MyPlayer = null;

          break;

      }
    }
    MyPlayerUpdate();
  }

  this.createPlayer = function(data) {
    if (Players.length == 0) {
      for (var i = 0; i < data.length; i++) {
        Players[i] = new Armata(data[i]);
        scene.add((Players[i].obj));
        scene.add(Players[i].kula.sphere);
        Players[i].skillPower = data[i].skillPower;
        Players[i].skillSpeed = data[i].skillSpeed;
        Players[i].skillReload = data[i].skillReload;
        Players[i].skillPoints = data[i].skillPoints;
        Players[i].speed = data[i].speed;
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
            scene.add(Players[i].kula.sphere)
            Players[i].skillPower = data[i].skillPower;
            Players[i].skillSpeed = data[i].skillSpeed;
            Players[i].skillReload = data[i].skillReload;
            Players[i].skillPoints = data[i].skillPoints;
            Players[i].speed = data[i].speed;
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

  this.shotPlayer = function(data) {
    for (var i = 0; i < Players.length; i++) {
      if ((Players[i].id) == (data.id)) {
        pl = Players[i];
        pl.x = data.x;
        pl.z = data.z;
        pl.positionF();

        pl.rotate = data.o;
        pl.rotateL = data.l;
        pl.rotateF();
        pl.rotateLufaF();
        that.shotKula(pl.id)
        break;
      }
    }
  }

  this.rotatePlayer = function(data) {
    for (var i = 0; i < Players.length; i++) {
      if ((Players[i].id) == (data.id)) {
        pl = Players[i];

        // var difference = (pl.rotate - data.o) / 2;
        // var x = 0;

        // if (pl.rotate > 3 * Math.PI / 2 && pl.rotate < 2 * Math.PI) {
        //   if (data.o > 0 && data.o < Math.PI / 2){
        //     console.log("przeskok1");
        //
        //   }
        // }

        // if (Math.sign(difference) == -1) {
        //   const diff = setInterval(function() {
        //     console.log(x + ":" + pl.rotate + " , " + data.o);
        //     if (pl.rotate > (2 * Math.PI)) {
        //       pl.rotate -= (2 * Math.PI);
        //     }
        //     if ((pl.rotate) >= (data.o)) {
        //       pl.rotate = data.o;
        //       pl.rotateF();
        //       console.log("koniec 1: " + pl.rotate + " , " + data.o);
        //       clearInterval(diff);
        //     }
        //     pl.rotate -= -0.01 //difference;
        //     pl.rotateF();
        //
        //     x++;
        //   }, 1000 / 60);
        //
        // } else {
        //   const diff = setInterval(function() {
        //     console.log(x + ":" + pl.rotate + " , " + data.o);
        //     if (pl.rotate < 0) {
        //       pl.rotate += 2 * Math.PI;
        //     }
        //     if ((pl.rotate) <= (data.o)) {
        //       pl.rotate = data.o;
        //       pl.rotateF();
        //       console.log("koniec 2: " + pl.rotate + " , " + data.o);
        //       clearInterval(diff);
        //     }
        //     pl.rotate -= 0.01 //difference;
        //     pl.rotateF();
        //     x++;
        //   }, 1000 / 60);
        // }
        pl.rotate = data.o;
        pl.rotateL = data.l;
        pl.rotateF();
        pl.rotateLufaF();
        break;
      }
    }
  }

  this.movePlayer = function(data) {
    for (var i = 0; i < Players.length; i++) {
      if ((Players[i].id) == (data.id)) {
        pl = Players[i];
        if (data.m == "w") {
          pl.x = data.x;
          pl.z = data.z;
          pl.kolo1.rotation.z += 0.1;
          pl.kolo2.rotation.z += 0.1;
          pl.positionF();
        } else if (data.m == "s") {
          pl.x = data.x;
          pl.z = data.z;
          pl.kolo1.rotation.z -= 0.1;
          pl.kolo2.rotation.z -= 0.1;
          pl.positionF();
        } else if (data.m == "r") {
          pl.x = data.x;
          pl.z = data.z;
          pl.kolo1.rotation.z -= 0.1;
          pl.kolo2.rotation.z -= 0.1;
          pl.positionF();
        }
        break;
      }
    }
  }

  this.visableTarget = function(visable){
    target.target.visible = visable;
    flightLine.flightLine.visible = visable;
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
