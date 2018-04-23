function Net() {
  var client;

  this.connect = function(){
    client = io();
    client.emit("new_user", $('#tb_login').val(), function(data){
    });

    client.on("movePlayer", function(data) {
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

  this.send = function(move) {
    client.emit("movePlayer", move)
  }

  this.id = function(){
    return (client.id);
  }

}
