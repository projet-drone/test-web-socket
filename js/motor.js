
const socket = io('http://192.168.43.81:3001');
//const socket = io('http://192.168.1.16:3000'); 
// const socket = io('http://192.168.1.17:3000');

// socket.on("scoreSended", data => {


// console.log(data)
// let score = data
let score = 6



document.querySelector('#plus').addEventListener('click', function () {
    score++

    let rotation = score * 36
    let prevRotate = (score - 1) * 36
    score++;
    console.log([score, prevRotate, rotation]);

    if (score >= 10) {
        gsap.to("#_spinner", { duration: 1, rotation: score * (rotation + prevRotate), repeat: -1, ease: Linear.easeNone });
    } else {
        gsap.to("#_spinner", { duration: 1, rotation: score * (rotation + prevRotate) });

        document.querySelector('#_pulse').classList.add('pulsed')
        setTimeout(() => {
            document.querySelector('#_spinner').style.display = "none";
            document.querySelector('#_finalAnimation').setAttribute('src', '../img/Exp-moteur-machine-apparition.gif');
            
        }, 1000);

        setTimeout(() => {
            document.querySelector('#_finalAnimationLoop').setAttribute('src', '../img/Exp-moteur-machine-loop.gif');
            
        }, 3500);

     
    }
})


// })