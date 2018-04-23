var http = require("http");
var fs = require("fs");
var qs = require("querystring")
var socketio = require("socket.io")

var server = http.createServer(function(req, res) {

  if (req.url == "/") {
    fs.readFile("static/index.html", function(error, data) {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(data);
      res.end();
    })
  } else if (req.url == "/css/style.css") {
    fs.readFile("static/css/style.css", function(error, data) {
      res.writeHead(200, {
        'Content-Type': 'text/css'
      });
      res.write(data);
      res.end();
    })
  } else if (req.url == "/libs/three.js") {
    fs.readFile("static/libs/three.js", function(error, data) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript'
      });
      res.write(data);
      res.end();
    })
  } else if (req.url == "/js/Game.js") {
    fs.readFile("static/js/Game.js", function(error, data) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript'
      });
      res.write(data);
      res.end();
    })
  } else if (req.url == "/js/PointerLockControls.js") {
    fs.readFile("static/js/PointerLockControls.js", function(error, data) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript'
      });
      res.write(data);
      res.end();
    })
  } else if (req.url == "/js/Armata.js") {
    fs.readFile("static/js/Armata.js", function(error, data) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript'
      });
      res.write(data);
      res.end();
    })
  } else if (req.url == "/js/Net.js") {
    fs.readFile("static/js/Net.js", function(error, data) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript'
      });
      res.write(data);
      res.end();
    })
  } else if (req.url == "/js/Ui.js") {
    fs.readFile("static/js/Ui.js", function(error, data) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript'
      });
      res.write(data);
      res.end();
    })
  } else if (req.url == "/js/Main.js") {
    fs.readFile("static/js/Main.js", function(error, data) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript'
      });
      res.write(data);
      res.end();
    })
  } else if (req.url == "/js/TextSprite.js") {
    fs.readFile("static/js/TextSprite.js", function(error, data) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript'
      });
      res.write(data);
      res.end();
    })
  } else if (req.url == "/mats/lufa.json") {
    fs.readFile("static/mats/lufa.json", function(error, data) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript'
      });
      res.write(data);
      res.end();
    })
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });
    res.write("<h1>404 - brak takiej strony</h1>");
    res.end();

  }
});


server.listen(3000, function() {
  console.log("serwer startuje na porcie 3000")
 });
//server.listen(3000, '192.168.100.106');

function Player(id, name) {
  this.id = id;
  this.name = name;
  this.x = Math.floor(Math.random() * 5000 - 2500)
  this.z = Math.floor(Math.random() * 5000 - 2500);
  this.speed = 10;
  this.rotateArmata = 0;
  this.rotateLufa = 7.5;
}

var Players = [];

var io = socketio.listen(server) // server -> server nodejs

io.sockets.on("connection", function(client) {
  //dodawnie nowego gracza + wysłanie mu listy aktalnych graczy


  client.on("new_user", function(data) {
    var pl = new Player(client.id, data);
    Players.push(pl);
    io.sockets.emit("Player", Players);
  });

  //obsługa poruszania graczy
  client.on("movePlayer", function(data) {
    for (var i = 0; i < Players.length; i++) {
      if ((Players[i].id) == (client.id)) {
        var pl = Players[i];

        if (data.rotateOBJ) {
          pl.rotateArmata -= data.rotateOBJ;
          io.sockets.emit("movePlayer", {
            rotateOBJ: pl.rotateArmata,
            id: client.id
          });
        } else if (data.rotateL) {
          pl.rotateLufa = data.rotateL;
          io.sockets.emit("movePlayer", {
            rotateL: pl.rotateLufa,
            id: client.id
          });
        } else if (data.move == "w") {
          pl.x += pl.speed * data.Direction_x;
          pl.z += pl.speed * data.Direction_z;
          io.sockets.emit("movePlayer", {
            move: "w",
            x: (pl.x),
            z: (pl.z),
            id: client.id
          });
        } else if (data.move == "s") {
          pl.x -= pl.speed * data.Direction_x;
          pl.z -= pl.speed * data.Direction_z;
          io.sockets.emit("movePlayer", {
            move: "s",
            x: (pl.x),
            z: (pl.z),
            id: client.id
          });
        }
      }
    }
  })

  //w przypadku rozłączenia usunięcie gracza z listy graczy
  client.on("disconnect", function() {
    for (var i = 0; i < Players.length; i++) {
      if ((Players[i].id) == (client.id)) {
        Players.splice(i, 1);
        io.sockets.emit("remove", client.id);
      }
    }
  })

})
