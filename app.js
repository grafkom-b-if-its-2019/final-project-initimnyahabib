var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/controller.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading controller.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var controllers = []
var channels = 1

var messageExchange = io
    .of('/start_controller')
    .on('connection', function (socket) {
        // Set the initial channel for the socket
        // Just like you set the property of any
        // other object in javascript
        socket.channel = "";

        // When the client joins a channel, save it to the socket
        socket.on("register", function (fn) {
            socket.channel = channels;
            fn(channels)
        });

        // When the client sends a message...
        socket.on("move", function (data) {
            // ...emit a "message" event to every other socket
            console.log('Move emmited')
            socket.broadcast.emit("movement", {
                channel: socket.channel,
                message: data.message
            });
        });
     });