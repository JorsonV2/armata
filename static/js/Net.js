function Net() {
  var client;

  this.connect = function() {
    client = io();
    client.emit("new_user", $('#tb_login').val(), function(data) {});

    client.on("mp", function(data) {
      //console.log(data);
      game.movePlayer(data);
    })

    client.on("rp", function(data) {
      game.rotatePlayer(data);
    })

    client.on("d", function(data) {
      if (data.d == "dead") {
        $("#restart").css("display", "block");
        game.visableTarget(false);
      } else {
        ui.changeHpPoints(data.d);
      }
    })

    client.on("k", function(data){
      game.removePlayer(data.id);
    })

    client.on("sp", function(data) {
      game.shotPlayer(data);
    })

    client.on("sk", function(data) {
      ui.allocateSkillPoint(date);
    })

    client.on("asp", function(){
      ui.addSkillPoint();
    })

    client.on("remove", function(data) {
      console.log("Gracz " + data + " opuscił gre :(");
      game.removePlayer(data);
    })

    client.on("Player", function(data) {
      game.createPlayer(data);
    })
  }

  this.movePlayer = function(move) {
    client.emit("mp", move)
  }

  this.bum = function(bum) {
    client.emit("b", bum)
  }

  this.skill = function(skill) {
    client.emit("sk", skill)
  }

  this.rotatePlayer = function(move) {
    client.emit("rp", move)
  }

  this.shotPlayer = function(move) {
    client.emit("sp", move)
  }

  this.id = function() {
    return (client.id);
  }

  this.new_user = function(){
    client.emit("new_user", $('#tb_login').val(), function(data) {});
  }

}
