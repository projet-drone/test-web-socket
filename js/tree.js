import Node from './Node.js';
import Cursor from './Cursor.js';

var nodeArray = []
var x = 0, y = 0;

// const socket = io('http://192.168.43.81:3001');
// // //const socket = io('http://172.17.128.251:3000');
// const socket = io('http://192.168.1.10:3000');

// socket.on("startHandShake",data =>{
//     console.log("c'est pas très covid ça")
//     socket.emit("HandShakeAnswered","SkillTreeWebApp:display")
// })

// // //socket.emit("joystickMoved", [0, 1])

// const inventors = {
//   SUMMER: 'summer',
//   WINTER: 'winter',
//   SPRING: 'spring'
// }

var canvas = document.getElementById("_testMap");
var cursor = document.getElementById("_cursor");
var nodes = document.querySelectorAll(".node");

const CURSOR = new Cursor(0, 0, 50, cursor)

nodes.forEach((node, idx) => {

  // Use node's circle position
  var position = node.querySelector('.circle').getBoundingClientRect();
  let newNode = new Node(position.top, position.left, 66, node)
  nodeArray.push(newNode)
  
  node.querySelector('.circle').addEventListener('click', () => {
  console.log(idx);
    console.log(document.querySelector(`#detail${idx}`));
    document.querySelector(`#detail${idx}`).classList.add('open')

  })
});
var swiper = new Swiper('.swiper-container', {
  direction: 'vertical',
  pagination: {
      el: '.swiper-pagination',
      clickable: true,
      type: 'progressbar',
  },
});

document.querySelector('#button1').addEventListener('click', () => {
  swiper.slideNext(300, false);
  console.log("ok");
})
document.querySelector('#button2').addEventListener('click', () => {
  swiper.slidePrev(300, false);
  console.log("ok");
})
document.querySelector('#button3').addEventListener('click', () => {
  document.querySelector(`.swiper-container`).classList.remove('open')
})

// socket.on("joystickMoved", dataString => {
  // console.log("joystick data received", dataString)
  // let data = dataString.split(":")

  // x += parseFloat(data[0]) * 4
  // y -= parseFloat(data[1]) * 4

  // // console.log(parseFloat(data[0]) );

  // CURSOR.moveCursor(x, y)
  // CURSOR.collisionHandler(nodeArray)
// })

// document.addEventListener('mousemove', function (event) {
//   x = event.pageX
//   y = event.pageY

  // let nodeOrigin = getOrigin(rect.left, rect.top, diameter)
  // let cursorOrigin = getOrigin(x, y, cursor.offsetWidth)

  // let distance = getDistance(nodeOrigin, cursorOrigin)

  // // console.log(distance);

  // if ( distance < diameter) {
  //   node.classList.add('active')
  //   cursor.classList.add('magnet')

  //   cursor.style.top = nodeOrigin.y - 36 + "px"
  //   cursor.style.left = nodeOrigin.x - 36 + "px"

  //   setTimeout(() => {
  //     document.querySelector('.gif').setAttribute('src', 'https://i.gifer.com/6mb.gif') ;
  //   }, 2500);

  //   console.log(nodeOrigin.x);

  // } else {
  //   node.classList.remove('active')
  //   cursor.classList.remove('magnet')
  // }
// });

// function drawBall() {
//   c.lineWidth = 3
//   c.strokeStyle = 'white'
//   c.beginPath()
//   c.arc(x, y, 30, 2 * Math.PI * 0.0001, 2 * Math.PI * 0.9999)
//   c.shadowColor = "blue"
//   c.shadowOffsetX = 0
//   c.shadowOffsetY = 0
//   c.shadowColor = "red"
//   c.shadowBlur = 20
//   c.stroke()
//   c.closePath();
// }

// function draw() {
//   c.clearRect(0, 0, canvas.width, canvas.height);
//   drawBall();
// }

// setInterval(draw, 10);

// let testCanvas = document.getElementById("_testMap")
// const c = testCanvas.getContext('2d')

// let mouseY = 0;
// let mouseX = 0;


// testCanvas.addEventListener('mousemove', function (event) {
//   mouseX = event.pageX
//   mouseY = event.pageY

//   moveCursor(mouseX, mouseY)

// });

// function draw(){
//   c.lineWidth = 3
//   c.strokeStyle = 'white' 
//   c.beginPath()
//   c.arc(mouseX, mouseY, 30, 2 * Math.PI * 0.0001, 2 * Math.PI *0.9999)
//   c.shadowColor = "blue" 
//   c.shadowOffsetX = 0
//   c.shadowOffsetY = 0
//   c.shadowColor = "red"
//   c.shadowBlur  = 20
//   c.stroke()
// }

// function moveCursor(x, y) {
//   console.log([x, y]);
//   c.translate(x, y)
// }




// // let coords = [20, 50]

// // socket.on("joystickMoved", data => {
// //     // console.log("joystick data received", data)

// //     coords[0] += parseFloat(data[0] * 10)
// //     coords[1] -= parseFloat(data[1] * 10)

// // })

// // requestAnimationFrame(draw)

// // function draw() {
// //     // ctx.clearRect(0, 0, 900, 600)
// //     ctx.fillStyle = 'rgb(200, 0, 0)';
// //     ctx.fillRect(coords[0], coords[1], 50, 50);
// //     console.log(coords)

// //     var blur = 10;
// //     var width = 60;
// //     ctx.shadowColor = "#000"
// //     ctx.shadowOffsetX = width;
// //     ctx.shadowOffsetY = 0;
// //     ctx.shadowBlur = blur;

// // }

// /*
//     Author: Stephen Bussard
//     Twitter: @sbussard
// */

// var img = new Image();
// img.onload = function() {
//     ctx.drawImage(img, 0, 0);
// }
// img.src = "/circle.svg";

// var sin = Math.sin;
// var cos = Math.cos;
// var tan = Math.tan;
// var ln = Math.log;
// var log = Math.LOG10E;
// var pi = Math.PI;
// var sqrt = Math.sqrt;
// var rnd = Math.random;
// var abs = Math.abs;

// var canvas = document.getElementById("_testMap")
// canvas.width = W = window.innerWidth;
// canvas.height = H = window.innerHeight;
// canvas.style.position = "absolute";
// canvas.style.zIndex = -2;
// document.body.appendChild(canvas);

// //var canvas = document.getElementById("canvas");
// var ctx = canvas.getContext("2d");
// var t = 0;

// var X = -121;
// var Y = 336;

// var phases = [];

// //var p = new Particle();
// var particles = [];
// for(var i=0;i<75;i++) {
//   particles.push(new Particle());
// }

// var modif = false;

// document.body.onclick = function() {
//   modif = modif?false:true;
// };

// document.body.onmousemove = function(event){
//   if(modif) {
//     cx = event.clientX;
//     cy = event.clientY;
//     X = (cx - W/2);
//     Y = (cy - H/2);
//     console.log(X,Y);
//   }
// };

// function Particle() {
// 	this.radius = (rnd()*100>>0)/10+1;

//   //phase offset
//   var phs = (rnd()*pi*100 >> 0);
// 	while(phases.indexOf(phs) != -1 && phases.length > 0) { 
// 		phs = (rnd()*75 >> 0); 
// 	}
// 	this.phase = phs;
// 	phases.push(phs);

// /*//pastels
//   var h = Math.random()*360>>0;
//   var s = Math.random()*100>>0;
//   var l = Math.random()*100>>0;
// 	this.color = "hsl("+h+",5%,20%)";
// */	
//   //green-blue neons
//   var h = (Math.random()*110>>0) + 100;
//   var s = (Math.random()*20>>0) + 80;
//   var l = 20;
//   var a = Math.random()*.8+.2;
// 	this.color = "hsla("+h+","+s+"%,"+l+"%,"+a+")";
// }


// function draw() {
// 	ctx.globalCompositeOperation = "source-over";
// 	ctx.fillStyle = "rgba(0, 0, 0, 1)";
// 	ctx.fillRect(0, 0, W, H);
//     ctx.globalCompositeOperation = "lighter";


//     ctx.beginPath();
//     ctx.arc(210, 75, 50, 0, 2 * Math.PI);
//     ctx.strokeStyle = "white";
//     //ctx.fillStyle = "transparent"
//     ctx.shadowColor = "red" 
//     shadowOffsetX = 5
//     shadowOffsetY = 5
//     shadowColor = "red"
//     shadowBlur  = 50
//     ctx.stroke();
//     ctx.fill();

//     var path = new Path2D('M cx - r, cy  a r,r 0 1,0 (r * 2),0 a r,r 0 1,0 -(r * 2),0');
//     ctx.stroke(path);

// 	t++;

//   for(var i=0;i<particles.length;i++) {
//     p = particles[i];

//     ctx.beginPath();
//     ctx.fillStyle = p.color;
//     ctx.arc(f( p ), g( p ), p.radius, Math.PI*2, false);
//     ctx.fill();

//     var A = sin(t/50)*p.radius*.5;
//     var B = cos(t/50)*p.radius*.5;


//     ctx.beginPath();
//     ctx.fillStyle = p.color;
//     ctx.arc(f( p ) + A, g( p ) + B, p.radius, Math.PI*2, false);
//     ctx.fill();
//   }
// 	setTimeout(draw, 33);
// }


// function f(p) {
// 	var u = t/5000 + p.phase;
// //	return p.x + W/2 + (H/6+X)*(cos(u/100)*cos(u)*2+sin(u));
// 	return ((W-X)/2)*(cos(u)*.2+sin(u*10)*.6+sin(u*100/2)*.3) + W/2;
// }

// function g(p) {
//   var u = t/5000 + p.phase;
// //  return p.y + H/2 + (H/6+Y)*(sin(u/100)*sin(u)*2+cos(u));
// 	return ((H-Y)/2)*(sin(u)*.2+cos(u*10)*.6+cos(u*100/2)*.3) + H/2;
// }

// draw();



// const drawC = function (radius, maxWidth, minWidth) {
//   const inc = (maxWidth - minWidth) / 10
//   let idx = 0;

//   console.log('inc : ' + inc);
//   for (let width = maxWidth; width >= minWidth; width -= 1) {


//       let opacity = idx * 0.02 ;
//       let red = idx * 50;
//     c.lineWidth = 10
//     // console.log(opacity);
//     console.log(idx);
//     idx++;
//     if (width > 10) { 
//       c.strokeStyle = 'rgba('+red+', 50, 255, '+ opacity +')'
//     } else {
//       c.strokeStyle = 'white' 
//     }

//   }

//   c.strokeStyle = 'white' 
//   c.beginPath()
//   c.arc(0, 0, radius, 2 * Math.PI * 0.0001, 2 * Math.PI *0.9999)
//   c.stroke()
// }

// c.translate(120, 170)
// drawC(30, 200, 10)
// c.rotate(2 * Math.PI * 0.75)
// drawC(100, 20, 4)

