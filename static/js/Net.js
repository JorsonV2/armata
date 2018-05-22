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

    client.on("sp", function(data) {
      game.shotPlayer(data);
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

  this.rotatePlayer = function(move) {
    client.emit("rp", move)
  }

  this.shotPlayer = function(move) {
    client.emit("sp", move)
  }

  this.id = function() {
    return (client.id);
  }

}
