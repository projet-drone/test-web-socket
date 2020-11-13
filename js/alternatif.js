const rpm = 100
const timeScaleDuration = 3
const tyreTweenDuration = 60 / rpm

// initialize _gsTransform object on element
TweenLite.set("#_magnets", {  transformOrigin:"50% 50%"});
 
const timeline = new TimelineMax()
  .timeScale(0)

const timeScaleTween = TweenLite.to(timeline, timeScaleDuration, {
  timeScale: 1,
  paused: true,
  ease: Linear.easeNone
})

let magnets = $('#_magnets')

timeline.to(magnets, tyreTweenDuration, {
  rotation: 360,
  ease: Linear.easeNone,
  repeat: -1,
}, 0)

const socket = io('http://192.168.8.103:3000');

gsap.registerPlugin(MotionPathPlugin);

var speed = 10
var totalProgression = 0;
var progression = 0;

var progressBar = document.getElementById('_progressBar');

$("#drive-button").click(() => {
  timeScaleTween.play()

  $('#_progressBar').addClass('active');
  $('#bulb').addClass('active');

  let dot = gsap.to("#_dot", {
    duration: 2,
    repeat: -1,
    yoyo: false,
    ease: "power0",
  
    motionPath: {
      path: "#_sin",
      align: "#_sin",
      autoRotate: true,
      alignOrigin: [0.5, 0.5]
    }
  });

});
$("#stop-button").click(() => {
  timeScaleTween.reverse()
});

$('.Alternatif').on('click', function() {
  
  timeScaleTween.play()

  $('#_progressBar').addClass('active');
  $('#bulb').addClass('active');

  let dot = gsap.to("#_dot", {
    duration: 2,
    repeat: -1,
    yoyo: false,
    ease: "power0",
  
    motionPath: {
      path: "#_sin",
      align: "#_sin",
      autoRotate: true,
      alignOrigin: [0.5, 0.5]
    }
  });
})


socket.on('altGenerator', data => {
  console.log(data)

  if ("startAlt") {
    timeScaleTween.play()

    $('#_progressBar').addClass('active');
    $('#bulb').addClass('active');

    let dot = gsap.to("#_dot", {
      duration: 2,
      repeat: -1,
      yoyo: false,
      ease: "power0",

      motionPath: {
        path: "#_sin",
        align: "#_sin",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
      }
    });

  } else if ("stopAlt") {
    timeScaleTween.reverse()
  }
})

// let magnet = gsap.to("#_magnets", {
//   duration: 0,
//   rotation: 360,
//   repeat: -1,
//   transformOrigin: '50% 50%',
//   yoyo: false,
//   ease: "power0",
//   // timeScale: 0.2
// });

// let dot = gsap.to("#_dot", {
//   duration: 0,
//   repeat: -1,
//   yoyo: false,
//   ease: "power0",
//   // timeScale: 0.2, 

//   motionPath: {
//     path: "#_sin",
//     align: "#_sin",
//     autoRotate: true,
//     alignOrigin: [0.5, 0.5]
//   }
// });


// socket.on("generatorRotated", data => {
//   console.log(data);

//   speed--


//   dot.duration(speed)
//   magnet.duration(speed)

//   progression = data * data * 10;
//   totalProgression += progression;
//   progressBar.style.width = totalProgression + "px";

// })

// document.querySelector('#debugPlus').addEventListener('click', () => {
//   speed--

//   progression = 50;
//   totalProgression += progression;
//   progressBar.style.width = totalProgression + "px";

//   // magnet.timeScale(1)
//   // dot.timeScale(1)
//   dot.duration(speed)
//   magnet.duration(speed)
// })