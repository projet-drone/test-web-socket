var io = require('socket.io')
var Client = require('./model/Client')

class ClientHandler{
    static instance = null
    server
    clients;

    static getinstance() {
        if (this.instance == null){
            this.instance = new ClientHandler()
        }
        
        return this.instance
    }

    listenForConnections(){
        io(this.server).on('connection',client => {

            this.identifyClient(client)
           
            console.log("connected")
        })
    }

    identifyClient(client){
        let newClient = new Client();

        newClient.client = client;

        client.emit("whoAreU",{responseEvent: "identify", responseForm:'name/type'})

        client.on("identify",data => {
            let explodedData = data.split("/")
            newClient.name = explodedData[0]
            newClient.type = explodedData[1]
        })

        this.clients.push(newClient)
    }
    
}
module.exports = ClientHandler;