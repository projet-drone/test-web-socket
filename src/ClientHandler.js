var io = require('socket.io')
var Client = require('./model/Client')


/**
 * types of clients that can conenct to the server
 */
const clientTypes = {
        SPHERO : "sphero",
        LIGHT : "light",
        MAP : "mappy",
        DISPLAY : "display",
}


/**
 * Singleton in charge of handeling clients, from connection to disconnetion
 */
class ClientHandler{
    static instance = null
    server
    socketTunnels = {}
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
                console.log(newClient.name)
            })
        

            //listening to disconnection
            client.on('disconnect', () => {
                console.log("clientToDisconnect",client);
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
            console.log("found element", element.name)
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

        client.emit("startHandShake",{responseEvent: "HandShakeAnswered", responseForm:'name/type'})

        client.on("HandShakeAnswered",data => {
            let explodedData = data.split(":")
            console.log("explodedData", explodedData)
            newClient.name = explodedData[0]
            newClient.type = explodedData[1]
            this.clients.push(newClient)
            identificationCallback(newClient)
            //this.sortInRightChannel(newClient)

            console.log("***********************************")
            console.log("connection",newClient.name)
            console.log("***********************************")
            console.log(this.clients.length)

            //client.emit("connectionState","connected")
            //console.log("new client",newClient.name + " : " + newClient.type)

        })

    }
/*
    sortInRightChannel(newClient){
        switch (newClient.type) {
            case clientTypes.SPHERO:
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
            case clientTypes.Map:
                newClient.client.join(clientTypes.MAP)
                console.log("new MAP detected")
                break;
            default:
                console.log("Unknown device")
                newClient.client.emit("error","wrong client type")
                break;
        }
    }
*/
    disconnectAll(){
        this.clients.forEach(client => {
            client.client.disconnect(true);
        });
    }

    createSocketTunnel(emitter,receiver,eventName){
        this.socketTunnels[eventName] = {emitter:emitter.client}
        emitter.client.on(eventName,(datas) =>{
            console.log("received " + datas + "on event : " + eventName)
            receiver.client.emit(eventName,datas)
        })
    }

    collapseSocketTunnel(eventName){
        if (this.socketTunnels.hasOwnProperty(eventName)){
            console.log(this.socketTunnels)
            this.socketTunnels[eventName].emitter.off(eventName,() => {})
            delete this.socketTunnels[eventName]
        }
    }
    
}
module.exports = {ClientHandler, clientTypes, io};