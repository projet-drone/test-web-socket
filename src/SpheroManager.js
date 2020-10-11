var io = require('socket.io')
var {ClientHandler, clientTypes} = require('./ClientHandler')
var {Sphero,spheroMods, SpheroMods} = require('./model/Sphero')


class SpheroManager {
    spheros = []
    neutralSpheros

    init(){
        let spherosClients = ClientHandler.getinstance().findClientByType(clientTypes.SPHERO)
        let neutralSpherosClients = ClientHandler.getinstance().findClientByType(clientTypes.NEUTRAL_SPHERO)


        spherosClients.forEach(client => {
            //console.log("this is a sphero", sphero.name)
            let newSphero = new Sphero(
                client.name,
                client.type,
                SpheroMods.PROXIMITY_DETECTOR,
                client.client,
                "idle",
            )
            this.spheros.push(newSphero)
        });
        neutralSpherosClients.forEach(client => {
            //console.log("this is a sphero", sphero.name)
            let newSphero = new Sphero(
                client.name,
                client.type,
                SpheroMods.GENERATOR,
                client.client,
                "idle"
            )
            this.neutralSpheros.push(newSphero)
        });
        
        this.pingAllSpheros()
    }

    listenForProximityDetection(){
        
    }

    activateAllInventorSpheros(){
        this.spheros.forEach(sphero => {
            sphero.activate()
        })
    }
    activate(spheroToActivate){
        this.spheros.forEach(sphero => {
            if (spheroToActivate == sphero) {
                sphero.activate()
            }else{
                sphero.disable()
            }
        })
    }

    pingAllSpheros(){
 
        this.spheros.forEach(sphero => {

            

            
            //console.log("this is a sphero", sphero.name)
            //io.sockets.emit("checkAllSpheroClients",{response:"pingServer"})
            sphero.client.emit("checkAllSpheroClients",{response:"pingServer"})
            sphero.client.on("pingServer",data => {
                console.log(data)
            })
        });
    }

}
module.exports = SpheroManager;
