var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const port = 3000 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
server.listen(port, function () {
    console.log('Express server listening on %d', port);
});

io.on('connection', (socket) => {

  console.log('a user connected');
  //socket.join('TheGreatChannel')

  socket.on('scoreSended', data => {
    console.log(data)
    socket.broadcast.emit("scoreSended",data)
  })

  socket.on("hello",data => {
    socket.emit("hello","yo");
    console.log(data)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});