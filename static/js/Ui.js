function Ui() {
  var that = this;
  var rot = [];
  var rotL = [];
  var element = document.body;
  var skill;
  var skillReload;
  var skillPower;
  var skillSpeed;
  var skillPoints = 0;
  var hp;
  var hpLine;
  var hpPoints = 100;
  var ranking;

  this.reload = 0;
  this.power = 0;
  this.speed = 0;

  //////////////////// Przypisanie do wartości odpowiednich elementów UI /////////////////////////

  skill = $('<div id="skill">');
  hp = $('<div id="hp">');
  ranking = $('<div id="ranking">');

  hpLine = $('<div id="hpLine">');
  hpLine.css("width", hpPoints + "%");
  hp.text(hpPoints);
  hp.append(hpLine)

  function updateHpLine(){
    hpLine.css("width", hpPoints + "%");
    hp.text(hpPoints);
    hp.append(hpLine)
  }

  this.changeHpPoints = function(HealthPoints){
    hpPoints = HealthPoints;
    updateHpLine();
  }

  this.decreaseHpPoints = function(HealthPoints){
    hpPoints -= HealthPoints;
    updateHpLine();
  }

  skill.append($('<span id="skillPoints">Skill Points: 0</span>'));
  skill.append($("<br>"))

  skillReload = $('<span>');
  skillReload.text("reload: " + that.reload + " ");
  skillReload.append($('<button id="skillReload">+</button>'));

  skillPower = $('<span>');
  skillPower.text("power: " + that.power + " ");
  skillPower.append($('<button id="skillPower">+</button>'));

  skillSpeed = $('<span>');
  skillSpeed.text("speed: " + that.speed + " ");
  skillSpeed.append($('<button id="skillSpeed">+</button>'));

  skill.append(skillReload);
  skill.append($("<br>"))
  skill.append(skillPower);
  skill.append($("<br>"))
  skill.append(skillSpeed);

  $(window).resize(function(){
    hp.css("left", ($(window).width() / 2) - (hp.width() / 2));
  })

  $("#control").append(skill);
  $("#control").append(hp);
  $("#control").append(ranking);

  hp.css("left", ($(window).width() / 2) - (hp.width() / 2));

  //------- Start gry --------------
  $("#btn_Go").on("click", function() {
    net.connect();
    that.changeHpPoints(100);
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
