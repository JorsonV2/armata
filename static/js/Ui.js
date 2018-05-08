function Ui() {
  var rot = [];
  var rotL = [];
  var element = document.body;
  //------- Start gry --------------
  $("#btn_Go").on("click", function() {
    net.connect();
    new_game();

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
    if (game.returnMyPlayer()) {
      var e = event.originalEvent;

      var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
      var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

      game.returnMyPlayer().obj.rotation.y -= movementX * 0.001; // zmiana rotacji playera
      if(game.returnMyPlayer().obj.rotation.y > 2 * Math.PI){
        game.returnMyPlayer().obj.rotation.y -= 2 * Math.PI;
        cameraRotation -= 2 * Math.PI;
      }
      else if(game.returnMyPlayer().obj.rotation.y < 0){
        game.returnMyPlayer().obj.rotation.y += 2 * Math.PI;
        cameraRotation += 2 * Math.PI;
      }


      game.returnMyPlayer().lufa.rotation.z -= movementY * 0.001;
      game.returnMyPlayer().lufa.rotation.z = Math.max(Math.PI * 0, Math.min(Math.PI * 0.40, game.returnMyPlayer().lufa.rotation.z));

      rot.push((game.returnMyPlayer().obj.rotation.y));
      rotL.push((game.returnMyPlayer().lufa.rotation.z));
      game.returnMyPlayer().kulaPosition();


      cameraRotation -= movementX * 0.001; // zmiana rotacji kamery

      cameraRotation = Math.max(game.returnMyPlayer().obj.rotation.y - Math.PI * 1.25, Math.min(game.returnMyPlayer().obj.rotation.y - Math.PI * 0.0, cameraRotation));

    }
  }

  var pointerlockchange = function(event) {
    if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element)
      $("body").on("mousemove", UsePointerLock)
    else {
      $("body").off("mousemove", UsePointerLock)
      $('<div id="pause"><h1>Pause</h1><button type="button" id="btn_pause">start!</button></div>').appendTo('body');
      $("#btn_pause").on("click", function() {
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock(); // włączenie blokady kursora
        $('#pause').remove();
      });
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
        move: "rot",
        rotateOBJ: (rot[rot.length - 1]),
        rotateL: (rotL[rotL.length - 1])
      }
      net.rotatePlayer(move);
      rot = [];
      rotL = [];
    }
  }, 100);
};
