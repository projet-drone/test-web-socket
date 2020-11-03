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
                "locked",
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

    unlock(sphero){
        sphero.state = "idle"
        sphero.disable()
    }

    lock(sphero){
        sphero.state = "locked"
    }

    activate(spheroToActivate){
        this.spheros.forEach(sphero => {
            if (spheroToActivate == sphero && spheroToActivate.state != "locked") {
                sphero.activate()
            }else if(spheroToActivate.state != "locked"){
                sphero.disable()
            }
        })
    }
    disable(spheroToDisable){

        if(spheroToDisable.state != "locked"){
            spheroToDisable.disable()
        }
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

        sphero.client.emit("switchMode",mod)
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
    switchJoystickDataSource(roomManager){
        this.spheros.forEach((sphero) => {
            sphero.client.on('silenceWenches',data =>{
                this.spheros.forEach((spheroThatNeedToShutUp) =>{
                    if (spheroThatNeedToShutUp != sphero && spheroThatNeedToShutUp) {
                        console.log("spheroThatNeedToShutUp", spheroThatNeedToShutUp.name)
                        spheroThatNeedToShutUp.client.emit("shutUp","shutUp")
                    }else{
                        console.log("spheroThatSpeaks", spheroThatNeedToShutUp.name)
                        roomManager.changeAmbiantColor(spheroThatNeedToShutUp.name)
                    }
                })
            })
        })
    }

}
module.exports = SpheroManager;
