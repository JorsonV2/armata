var game;
var net;
var ui;
var models;

$(document).ready(function () {
      models = new Models();
      net = new Net();
      ui = new Ui();
})

function new_game(){
  game = new Game()
}
