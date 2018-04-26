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
  } else {
    file(req, res);
  }
});

function file(req, res) {
  var url = req.url;
  var split = url.split("/");
  var file = split[split.length - 1];
  var format = file.split(".")[1];
  var content;
  if (format == "js" || format == "json") {
    content = "application/javascript";
    file2();
  } else if (format == "css") {
    content = "text/css";
    file2();
  } else if (format == "html") {
    content = "text/html";
    file2();
  } else if (format == "png" || format == "jpg") {
    content = "image/jpeg";
    file2();
  } else {
    console.log(url);
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });
    res.write("<h1>404 - brak takiej strony</h1>");
    res.end();
  }

  function file2() {
    fs.readFile(("static" + url), function(error, data) {
      res.writeHead(200, {
        'Content-Type': content
      });
      res.write(data);
      res.end();
    })
  }

}

// server.listen(3000, function() {
//   console.log("serwer startuje na porcie 3000")
// });
server.listen(3000, '192.168.100.104');

function Player(id, name) {
  this.id = id;
  this.name = name;
  this.x = Math.floor(Math.random() * 5000 - 2500)
  this.z = Math.floor(Math.random() * 5000 - 2500);
  this.speed = 10;
  this.rotateArmata = 0;
  this.rotateLufa = Math.PI * 0.3;
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

        if (data.rotateOBJ || data.rotateL) {
          pl.rotateArmata = data.rotateOBJ;
          pl.rotateLufa = data.rotateL;
          client.broadcast.emit("movePlayer", {
            rotateOBJ: pl.rotateArmata,
            rotateL: pl.rotateLufa,
            id: client.id
          });
        } else if (data.move == "w") {
          pl.x += pl.speed * data.Direction_x;
          pl.z += pl.speed * data.Direction_z;
          client.broadcast.emit("movePlayer", {
            move: "w",
            x: (pl.x),
            z: (pl.z),
            id: client.id
          });
        } else if (data.move == "s") {
          pl.x -= pl.speed * data.Direction_x;
          pl.z -= pl.speed * data.Direction_z;
          client.broadcast.emit("movePlayer", {
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
