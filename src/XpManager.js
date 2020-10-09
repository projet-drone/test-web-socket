var ClientHandler = require('./ClientHandler')

class XpManager{
    roomManager;
    spheroManager;
    mapManager;

    init(){
        console.log("bagadoom")
        ClientHandler.getinstance().listenForConnections()
    }

}

module.exports = XpManager