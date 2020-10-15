var io = require('socket.io')
var {ClientHandler, clientTypes} = require('./ClientHandler')
var {Sphero, SpheroMods} = require('./model/Sphero')


class SpheroManager {
    spheros = []

    init(){
        let spherosClients = ClientHandler.getinstance().findClientByType(clientTypes.SPHERO)
        
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
    disable(spheroToDisable){
        spheroToDisable.disable()
    }

    findSpheroByName(name){
        let spheroToRetrun = null
        this.spheros.forEach(sphero => {
            if(sphero.name == name){
                spheroToRetrun = sphero
            }
        })
        return spheroToRetrun
            
    }

    switchSpheroMod(sphero,mod,modSwitched){
        sphero.switchMode(mod,modSwitched)

        sphero.client.emit("switchMod",mod)
    }

    listenForJoystickConnection(spheroConnected){
        this.spheros.forEach((sphero) =>{
            sphero.client.on('connectedAsJoystick',() =>{
                spheroConnected(sphero)
            })
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
