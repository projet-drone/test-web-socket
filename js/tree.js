
//const socket = io('http://192.168.43.81:3000');
const socket = io('http://172.17.128.251:3000');

socket.emit("joystickMoved", [0, 1])

let testCanvas = document.getElementById("_testMap")
let ctx = testCanvas.getContext('2d')

let coords = [20, 50]

socket.on("joystickMoved", data => {
    // console.log("joystick data received", data)
    coords[0] += parseFloat(data[0])
    coords[1] -= parseFloat(data[1])
    requestAnimationFrame(draw)

})

function draw() {
    ctx.clearRect(0, 0, 900, 600)
    ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillRect(coords[0], coords[1], 50, 50);
    // console.log(coords)
}