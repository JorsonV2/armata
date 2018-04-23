function Ui() {
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
  var UsePointerLock = function (event) {
      var e = event.originalEvent;

      var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
      var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

      //wysyłanie rotacji na serwer

    //  armata.getCont().rotation.y -= movementX * 0.002; // zmiana rotacji playera

    //  armata.getMesh().rotation.x -= movementY * 0.002;
    //  armata.getMesh().rotation.x = Math.max(Math.PI * 0, Math.min(Math.PI * 0.5, armata.getMesh().rotation.x)); // zmiana kątu lufy

      var rot = movementX * 0.002;
      var move = {
        rotateOBJ: rot
      }
      net.send(move);
      game.returnMyPlayer().obj.rotation.y -= movementX * 0.002; // zmiana rotacji playera
      cameraRotation -= movementX * 0.002; // zmiana rotacji kamery
  }

  var pointerlockchange = function (event) {
      if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element)
          $("body").on("mousemove", UsePointerLock)
      else{
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

};
