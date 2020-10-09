//const socket = io('http://192.168.43.81:3000');
//const socket = io('http://172.17.128.251:3000');
const socket = io('http://192.168.1.10:3000');

var totalProgression = 0;
var progression = 0;

var progressBar = document.getElementById('_progressBar');

socket.on("scoreSended", data => {

    
    progression = data * 10;
    totalProgression = totalProgression + progression;
    
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