var io = require('socket.io')
var Client = require('./model/Client')


/**
 * types of clients that can conenct to the server
 */
const clientTypes = {
        SPHERO : "sphero",
        NEUTRAL_SPHERO : "neutral_sphero",
        LIGHT : "light",
        MAP : "map",
        DISPLAY : "display",
}


/**
 * Singleton in charge of handeling clients, from connection to disconnetion
 */
class ClientHandler{
    static instance = null
    server
    clients = [];

    

    static getinstance() {
        if (this.instance == null){
            this.instance = new ClientHandler()
        }
        
        return this.instance
    }



    /**
     * listen for new connection and trigger its identification
     * @param {*} connectionCallBack 
     * @param {*} disconnectionCallBack 
     */
    listenForConnections(connectionCallBack,disconnectionCallBack){
        io(this.server).on('connection',client => {

            this.identifyClient(client,(newClient) =>{
                connectionCallBack(newClient)
            })
        

            //listening to disconnection
            client.on('disconnect', () => {
                let clientToDelete = this.findClientFromSocket(client)
                disconnectionCallBack(clientToDelete)
                this.clients.splice(clientToDelete.index,1)
                console.log("disconnected")
                //console.log("test")
            })
        })
    }

    findClientFromSocket(client){
        let foundClient = null
        for (let i = 0; i < this.clients.length; i++) {
            const element = this.clients[i];
            
            if (client == element.client) {
                //this.clients.splice(i,1)
                foundClient = element
                return {client :foundClient, index:i}

            }
        }
    }

    findClientByType(type){
        let foundClients = []
        for (let i = 0; i < this.clients.length; i++) {
            const element = this.clients[i];
            console.log(element.name)
            if (type == element.type) {
                //this.clients.splice(i,1)
                foundClients.push(element)
 
            }
        }
        return foundClients
    }
    
    identifyClient(client, identificationCallback){
        let newClient = new Client();

        newClient.client = client;

        client.emit("startHandShake",{responseEvent: "identify", responseForm:'name/type'})

        client.on("HandShakeAnswered",data => {
            let explodedData = data.split(":")
            newClient.name = explodedData[0]
            newClient.type = explodedData[1]
            this.clients.push(newClient)
            identificationCallback(newClient)
            this.sortInRightChannel(newClient)

            //console.log("new client",newClient.name + " : " + newClient.type)

        })

    }

    sortInRightChannel(newClient){
        switch (newClient.type) {
            case clientTypes.SPHERO:
            case clientTypes.NEUTRAL_SPHERO:
                newClient.client.join(clientTypes.SPHERO)
                console.log("new Sphero detected")

                break;
            case clientTypes.LIGHT:
                newClient.client.join(clientTypes.LIGHT)
                console.log("new LIGHT detected")
                break;
            case clientTypes.MAP:
                newClient.client.join(clientTypes.MAP)
                console.log("new MAP detected")
                break;
            case clientTypes.DISPLAY:
                newClient.client.join(clientTypes.DISPLAY)
                console.log("new DISPLAY detected")
                break;
            default:
                console.log("Unknown device")
                newClient.client.emit("error","wrong client type")
                break;
        }
    }

    disconnectAll(){
        this.clients.forEach(client => {
            client.client.disconnect(true);
        });
    }
    
}
module.exports = {ClientHandler, clientTypes, io};