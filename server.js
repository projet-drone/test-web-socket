

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io');

var ExperienceManager = require('./src/XpManager')
var {ClientHandler} = require('./src/ClientHandler')

const port = 3002

server.listen(process.env.PORT || 3002, function () {
  console.log('Express server listening on %d', port);
});


let xpManager = new ExperienceManager()

let clientHandler = ClientHandler.getinstance()
clientHandler.server = server;
clientHandler.ioObject = io;

try {
  xpManager.init()
} catch (error) {
  console.log(error)
}



console.log(clientHandler.clients)
const events = [
  {event:"scoreSended",hint:"score to send to rotate the motor in the motor experience",expectedType:"Int"},
  {event:"joystickMoved",hint:"sphero joystick data to send to move in the skill tree",expectedType:"Array of coordinates [x,y]"},
  {event:"generatorRotated",hint:"number of circle per second",expectedType:"number"},
  {event:"hello",hint:"debug",expectedType:"Any"},
  {event:"hello",hint:"debug",expectedType:"nothing"},
]

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });


let sockets = {}
let countUsers = 0
let shouldFarLightTurnOn = false
/*io.on('connection', (socket) => {
  countUsers ++ 
  console.log('a user connected');
  console.log(countUsers);
  socket.emit("startHandShake")
  socket.on("HandShakeAnswered",(data) => {
    let explodedData = data.split(":")
    console.log("explodedData", explodedData)
    sockets[explodedData[0]] = {socket: socket, name:explodedData[0]}
    console.log("sockets",sockets)
  })*/
  //socket.emit("startHandShake",{responseEvent: "HandShakeAnswered", responseForm:'name/type'})

  /*socket.on("HandShakeAnswered",data => {
      
      console.log("***********************************")
      console.log("connection",data)
      console.log("***********************************")

      //client.emit("connectionState","connected")
      //console.log("new client",newClient.name + " : " + newClient.type)

  })*/
  //socket.emit("event","events")

  /*socket.on("pizza-cordon-bleu", data => {
    socket.emit("miam",events)
  })*/
 /*socket.on('edisonCompleted', data => {
    console.log(data)
    shouldFarLightTurnOn = false
    //sockets["exterieur"].socket.emit("edisonCompleted",data)
    sockets["led"].socket.emit("edisonCompleted",data)
    sockets["motor"].socket.emit("edisonCompleted",data)
    sockets["farMotor"].socket.emit("edisonCompleted",data)
  })
  socket.on('westinghouseCompleted', data => {
    console.log(data)
    shouldFarLightTurnOn = true
    //sockets["exterieur"].socket.emit("westinghouseCompleted",data)
    sockets["led"].socket.emit("westinghouseCompleted",data)
    sockets["motor"].socket.emit("westinghouseCompleted",data)
    sockets["farMotor"].socket.emit("westinghouseCompleted",data)
  })
  socket.on('teslaCompleted', data => {
    shouldFarLightTurnOn = true
    console.log(data)
    //sockets["exterieur"].socket.emit("teslaCompleted",data)
    sockets["led"].socket.emit("teslaCompleted",data)
    sockets["motor"].socket.emit("teslaCompleted",data)
    sockets["farMotor"].socket.emit("teslaCompleted",data)
  })*/
  /*socket.on('lightUp', data => {
    console.log(data)
    if (//sockets["exterieur"]) {
      //sockets["exterieur"].socket.emit("lightUp",data)
    }
  })*/

  /*socket.on('turnOff', data => {
    console.log(data)
    if (//sockets["exterieur"]) {
      //sockets["exterieur"].socket.emit("turnOff",data)
    }
  })*/

  /*socket.on('scoreSended', data => {
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

  socket.on("generatorRotated", data => {
    console.log(data)
    
    socket.broadcast.emit("generatorRotated",coords)
  })
  */
  /*socket.on("hello",data => {
    //socket.emit("hello","yo");
    
    console.log(data)
  })

  socket.on('disconnect', () => {
    let name = "interieur"
    if (sockets[name] && sockets[name].socket == socket ) {
      console.log( name + ' disconnected');
    }
    
  })
});*/