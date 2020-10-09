var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const port = 3000 
const events = [
  {event:"scoreSended",hint:"score to send to rotate the motor in the motor experience",expectedType:"Int"},
  {event:"joystickMoved",hint:"sphero joystick data to send to move in the skill tree",expectedType:"Array of coordinates [x,y]"},
  {event:"hello",hint:"debug",expectedType:"Any"},
  {event:"hello",hint:"debug",expectedType:"nothing"},
]

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(port, function () {
    console.log('Express server listening on %d', port);
});

io.on('connection', (socket) => {

  console.log('a user connected');
  //socket.join('TheGreatChannel')

  socket.on("pizza-cordon-bleu", data => {
    socket.emit("miam",events)
  })

  socket.on('scoreSended', data => {
    console.log(data)
    socket.broadcast.emit("scoreSended",data)
  })

  socket.on("joystickMoved", data => {
    console.log(data)
    data = data+ ''
    console.log(typeof(data))
    let coords = data.split(":")
    socket.broadcast.emit("joystickMoved",coords)
  })

  socket.on("hello",data => {
    socket.emit("hello","yo");
    console.log(data)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});