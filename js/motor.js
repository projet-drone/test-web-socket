// const socket = io('http://192.168.8.105:3000');
const socket = io('http://192.168.1.38:3000');

let score = 0

socket.on("startHandShake", data => {
    console.log("c'est pas très covid ça")
    socket.emit("HandShakeAnswered", "MotorWebApp:display")
})

document.querySelector('#_connection').addEventListener('click', function () {
    document.querySelector('#_connection').classList.add('hidden');
    document.querySelector('#_connection').style.display = "none";
    console.log("co");
})

document.querySelector('#_shake').addEventListener('click', function () {
    document.querySelector('#_shake').classList.add('hidden');
    document.querySelector('#_connection').style.display = "none";

})
document.querySelector('#debug').addEventListener('click', function () {
    autoPlay()
})

function autoPlay() {    
    document.querySelector('#_shake').classList.add('hidden');
    let index = 36
   
    setTimeout(() => {

        gsap.to("#_spinner", { duration: 1, rotation: index = (index * 2), repeat: -1, ease: Linear.easeNone });
    
    }, 1000);

    setTimeout(() => {
        gsap.to("#_spinner", { duration: 1, rotation: index = (index * 3), repeat: -1, ease: Linear.easeNone });
    
    }, 2500);

    setTimeout(() => {
        gsap.to("#_spinner", { duration: 1, rotation: index = (index * 4), repeat: -1, ease: Linear.easeNone });
    
    }, 4000);

    setTimeout(() => {
        
        gsap.to("#_spinner", { duration: 1, rotation: index = (index * 5), repeat: -1, ease: Linear.easeNone });
    }, 5500);
    setTimeout(() => {
       
        gsap.to("#_spinner", { duration: 1, rotation: index = (index * 6), repeat: -1, ease: Linear.easeNone });
    }, 5000);

    setTimeout(() => {
        gsap.to("#_spinner", { duration: 1, rotation: index * (rotation + prevRotate), repeat: -1, ease: Linear.easeNone });
        document.querySelector('#_pulse').classList.add('pulsed')
    }, 6000);


    setTimeout(() => {
        document.querySelector('#_spinner').style.display = "none";
        document.querySelector('#_finalAnimation').setAttribute('src', '../img/Exp-moteur-machine-apparition.gif');
    
    }, 7000);
    
    setTimeout(() => {
        
        document.querySelector('#_finalAnimationLoop').setAttribute('src', '../img/Exp-moteur-machine-loop.gif');
    
    }, 9400);
    
}

document.querySelector('#debug').addEventListener('click', function () {
   
    score++

    let rotation = (score - 4) * 36
    let prevRotate = ((score - 1) - 4) * 36

    if (score >= 10) {
        gsap.to("#_spinner", { duration: 1, rotation: score * (rotation + prevRotate), repeat: -1, ease: Linear.easeNone });

        document.querySelector('#_pulse').classList.add('pulsed')
        setTimeout(() => {
            document.querySelector('#_spinner').style.display = "none";
            document.querySelector('#_finalAnimation').setAttribute('src', '../img/Exp-moteur-machine-apparition.gif');

        }, 1000);

        setTimeout(() => {
            document.querySelector('#_finalAnimationLoop').setAttribute('src', '../img/Exp-moteur-machine-loop.gif');

            socket.emit("MotorActivityCompleted", "")
        }, 3500);

    } else if (score >= 3) {

        gsap.to("#_spinner", { duration: 1, rotation: score * (rotation + prevRotate) });

    } else if (score >= 2) {
        document.querySelector('#_shake').classList.add('hidden');
    }
})

socket.on("sendMotorData", data => {

    console.log(data);
    score++

    let rotation = (score - 4) * 36
    let prevRotate = ((score - 1) - 4) * 36

    if (score >= 10) {
        gsap.to("#_spinner", { duration: 1, rotation: score * (rotation + prevRotate), repeat: -1, ease: Linear.easeNone });

        document.querySelector('#_pulse').classList.add('pulsed')
        setTimeout(() => {
            document.querySelector('#_spinner').style.display = "none";
            document.querySelector('#_finalAnimation').setAttribute('src', '../img/Exp-moteur-machine-apparition.gif');

        }, 1000);

        setTimeout(() => {
            document.querySelector('#_finalAnimationLoop').setAttribute('src', '../img/Exp-moteur-machine-loop.gif');

            socket.emit("MotorActivityCompleted", "")
        }, 3500);

    } else if (score >= 3) {

        gsap.to("#_spinner", { duration: 1, rotation: score * (rotation + prevRotate) });

    } else if (score >= 2) {
        document.querySelector('#_shake').classList.add('hidden');
    }
})