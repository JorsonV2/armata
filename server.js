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

server.listen(3000, function() {
  console.log("serwer startuje na porcie 3000")
});
//server.listen(3000, '192.168.100.104');

function Player(id, name) {
  this.x = Math.floor(Math.random() * 5000 - 2500)
  this.z = Math.floor(Math.random() * 5000 - 2500);
  this.rotateArmata = 0;
  this.rotateLufa = Math.PI * 0.3;

  this.id = id;
  this.name = name;
  this.hp = 100;
  this.speed = 500;

  this.skillSpeed = 0;
  this.skillPower = 0;
  this.skillReload = 0;
  this.skillPoints = 0;
}

var Players = [];

var io = socketio.listen(server) // server -> server nodejs

// setInterval(function() {
//   if (move.length != 0) {
//   //  console.log("Wysyłam");
//     wys();
//     move = [];
//   }
// }, 100);

io.sockets.on("connection", function(client) {
  //dodawnie nowego gracza + wysłanie mu listy aktalnych graczy
  wys = function() {
    io.sockets.emit("movePlayer", move);
  }

  client.on("new_user", function(data) {
    var pl = new Player(client.id, data);
    Players.push(pl);
    io.sockets.emit("Player", Players);
  });

  //obsługa poruszania graczy
  client.on("mp", function(data) {
    for (var i = 0; i < Players.length; i++) {
      if ((Players[i].id) == (client.id)) {
        var pl = Players[i];
        if (data.m == "w") {
          pl.x += (pl.speed + (20 * pl.skillSpeed)) * data.x;
          pl.z += (pl.speed + (20 * pl.skillSpeed)) * data.z;
          client.broadcast.emit("mp", {
            id: client.id,
            m: "w",
            x: (pl.x),
            z: (pl.z)
          });

        } else if (data.m == "s") {
          pl.x -= (pl.speed + (20 * pl.skillSpeed)) * data.x;
          pl.z -= (pl.speed + (20 * pl.skillSpeed)) * data.z;
          client.broadcast.emit("mp", {
            id: client.id,
            m: "s",
            x: (pl.x),
            z: (pl.z),
          });
        } else if (data.m == "r") {
          pl.x -= pl.speed * data.x;
          pl.z -= pl.speed * data.z;
          io.sockets.emit("mp", {
            id: client.id,
            m: "r",
            x: (pl.x),
            z: (pl.z),
          });
        }
        break;
      }
    }
  });

  client.on("rp", function(data) {
    for (var i = 0; i < Players.length; i++) {
      if ((Players[i].id) == (client.id)) {
        var pl = Players[i];
        pl.rotateArmata = data.o;
        pl.rotateLufa = data.l;
        client.broadcast.emit("rp", {
          id: client.id,
          o: pl.rotateArmata,
          l: pl.rotateLufa
        });
        break;
      }
    }
  });

  client.on("b", function(data) {
    for (var i = 0; i < Players.length; i++) {
          var r = 750;
          var d = Math.sqrt(Math.pow((Players[i].x - data.x), 2) + Math.pow((Players[i].z - data.z), 2));
          if (d < r) {
            var x = 100 - (d / 750 * 100)
            if(x > 90){
              x = 100;
            }
            Players[i].hp -= x;
            x = Players[i].hp;
            
            if(Players[i].hp <= 0){
              x = "dead";
              io.sockets.emit("k", {
                id: Players[i].id
              })
            }

            io.sockets.to(Players[i].id).emit("d", {
              d: x
            });

            io.sockets.emit("o", {
              id: Players[i].id,
              x: Players[i].x - data.x,
              z: Players[i].z - data.z
            })

            if(Players[i].hp <= 0){
              Players.splice(i, 1);
            }
          }
    }
  });

  client.on("sp", function(data) {
    for (var i = 0; i < Players.length; i++) {
      if ((Players[i].id) == (client.id)) {
        var pl = Players[i];
        // pl.x -= pl.speed * data.Direction_x;
        // pl.z -= pl.speed * data.Direction_z;
        pl.rotateArmata = data.o;
        pl.rotateLufa = data.l;
        client.broadcast.emit("sp", {
          id: client.id,
          x: (pl.x),
          z: (pl.z),
          o: pl.rotateArmata,
          l: pl.rotateLufa
        });
        break;
      }
    }
  })

  client.on("sk", function(dane) {
    for (var i = 0; i < Players.length; i++) {
      if ((Players[i].id) == (client.id)) {
        var pl = Players[i];
        if(pl.skillPoints < pl.skillPower + pl.skillSpeed + pl.skillReload){
          pl.skillPower = 0;
          pl.skillSpeed = 0;
          pl.skillReload = 0;
          io.sockets.emit("sk", {
            id: client.id,
            skill: "noob"
          })
        }
        else {
          switch(dane.skill){
            case "power":
              pl.skillPower ++;
              io.sockets.emit("sk", {
                id: client.id,
                skill: "power"
              })
              break;
            case "speed":
              pl.skillSpeed ++;
              io.sockets.emit("sk", {
                id: client.id,
                skill: "speed"
              })
             break;
            case "reload":
             pl.skillReload ++;
              io.sockets.emit("sk", {
                id: client.id,
                skill: "reload"
              })
              break;
          }
        }
        break;
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
