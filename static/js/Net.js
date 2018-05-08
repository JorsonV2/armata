function Net() {
  var client;

  this.connect = function() {
    client = io();
    client.emit("new_user", $('#tb_login').val(), function(data) {});

    client.on("movePlayer", function(data) {
    //  console.log(data);
      //  game.movePlayer(data);
    })

    client.on("movePlayer2", function(data) {
      game.movePlayer(data);
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
    client.emit("movePlayer", move)
  }

  this.rotatePlayer = function(move) {
    client.emit("rotatePlayer", move)
  }

  this.shotPlayer = function(move) {
    client.emit("shotPlayer", move)
  }

  this.id = function() {
    return (client.id);
  }

}
