const socket = io('http://192.168.1.38:3000');


$('#start').click(() => {
    socket.on('stateGenerator', data => {
        console.log(data)
      })
})
