function Ui() {
  var that = this;
  var rot = [];
  var rotL = [];
  var element = document.body;

  //------- Start gry --------------
  $("#btn_Go").on("click", function() {
    net.connect();
    new_game();

    $("#control").css("display", "block");

    //obsługa myszki
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestPointerLock(); // włączenie blokady kursora
  });


  //------- Tablica klikniętych klawiszy --------------
  this.map = {}; // You could also use an array
  onkeydown = onkeyup = function(e) {
    e = e || event; // to deal with IE
    ui.map[e.keyCode] = e.type == 'keydown';
    /* insert conditional here */
  }

  //////////////////////// obsługa myszki////////////////////////////////////////////////////////////////////////////////////////
  var UsePointerLock = function(event) {
    if (game.returnMyPlayer() && game.returnMyPlayer().recoilTime <= 0) {
      var e = event.originalEvent;

      var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
      var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

      game.returnMyPlayer().obj.rotation.y -= movementX * 0.001; // zmiana rotacji playera
      if (game.returnMyPlayer().obj.rotation.y > 2 * Math.PI) {
        game.returnMyPlayer().obj.rotation.y -= 2 * Math.PI;
        cameraRotation -= 2 * Math.PI;
      } else if (game.returnMyPlayer().obj.rotation.y < 0) {
        game.returnMyPlayer().obj.rotation.y += 2 * Math.PI;
        cameraRotation += 2 * Math.PI;
      }


      game.returnMyPlayer().lufa.rotation.z -= movementY * 0.001;
      game.returnMyPlayer().lufa.rotation.z = Math.max(Math.PI * 0, Math.min(Math.PI * 0.40, game.returnMyPlayer().lufa.rotation.z));

      rot.push((game.returnMyPlayer().obj.rotation.y));
      rotL.push((game.returnMyPlayer().lufa.rotation.z));
      game.returnMyPlayer().kulaPosition();


      cameraRotation -= movementX * 0.001; // zmiana rotacji kamery

      cameraRotation = Math.max(game.returnMyPlayer().obj.rotation.y - Math.PI * 1.25, Math.min(game.returnMyPlayer().obj.rotation.y - Math.PI * 0.75, cameraRotation));

    }
  }

  var pointerlockchange = function(event) {
    if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element)
      $("body").on("mousemove", UsePointerLock)
    else {
      $("body").off("mousemove", UsePointerLock)
      $('#pause').css("display", "block")
    }
  };

  document.addEventListener('pointerlockchange', pointerlockchange, false);
  document.addEventListener('mozpointerlockchange', pointerlockchange, false);
  document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  //kontrola wysyłanie rotacji na serwer
  setInterval(function() {
    if ((rot.length != 0) || (rotL.length != 0)) {
      var move = {
        o: (game.round((rot[rot.length - 1]), 3)),
        l: (game.round((rotL[rotL.length - 1]), 3))
      }
      net.rotatePlayer(move);
      rot = [];
      rotL = [];
    }
  }, 100);

  //////////////////// Controls /////////////////////////
  this.changeHpPoints = function(data) {
    game.returnMyPlayer().hp = data;
    $("#hp_bar").val(data);
  }

  this.changeReload = function(data) {
    $("#reload_bar").val(data);
  }

  this.resetPlayer = function(){
    net.new_user();
    game.visableTarget(true);
    this.changeHpPoints(100);
  }

  $("#revive").on("click", function(){
    $("#restart").css("display", "none");
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestPointerLock(); // włączenie blokady kursora
    $('#pause').css("display", "none")
    that.resetPlayer();
  })

  $("#btn_pause").on("click", function() {
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestPointerLock(); // włączenie blokady kursora
    $('#pause').css("display", "none")
  });
};
