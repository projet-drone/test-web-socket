const socket = io('http://192.168.43.81:3001');
// const socket = io('http://192.168.1.38:3001');
//const socket = io('http://192.168.1.16:3000'); 

var totalProgression = 0;
var progression = 0;

var progressBar = document.getElementById('_progressBar');
var magnet = document.getElementById('_magnets');

gsap.to("#_magnets", { duration: 1, rotation: 360, loop: true});


socket.on("generatorRotated", data => {
    console.log(data);
    progression = data * data * 10;
    totalProgression += progression;
    
    console.log([totalProgression, progression])
    progressBar.style.width = totalProgression + "px";

  

    if (totalProgression >= 900) {
        // end 

    } else if (totalProgression >= 500) {
        // speed ++ sinus animation
    
    } else if (totalProgression >= 50) {
        // speed + sin animation

    } else {
        // start sinus animation
        
    }
})