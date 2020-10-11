var {ClientHandler,clientTypes} = require('./ClientHandler')
var RoomManager = require('./RoomManager')
var SpheroManager = require('./SpheroManager')

class XpManager{
    roomManager;
    spheroManager;
    mapManager;

    nbInventorSpheros = 0
    nbneutralSpheros = 0

    expectedInventorSpheroNumber = 3
    expectedNeutralSpheroNumber = 2

    init(){
        ClientHandler.getinstance().listenForConnections((newClientConnected) => {

            if (newClientConnected.type == clientTypes.SPHERO) {
                this.nbInventorSpheros += 1
                console.log('nbInventorSpheros',this.nbInventorSpheros)
            }

            if (newClientConnected.type == clientTypes.NEUTRAL_SPHERO) {
                this.nbneutralSpheros += 1
                console.log('nbneutralSpheros',this.nbneutralSpheros)
            }

            if (this.nbInventorSpheros == this.expectedInventorSpheroNumber){
                this.spheroManager.init()

                this.spheroManager.activate(this.spheroManager.spheros[0])
                this.spheroManager.activate(this.spheroManager.spheros[1])
                this.spheroManager.activate(this.spheroManager.spheros[2])

            }
        },
        (clientToDelete) => {
            
            console.log("switchType",clientToDelete.client.type)
            switch (clientToDelete.client.type) {
                case clientTypes.SPHERO:
                    this.nbInventorSpheros -= 1
                    break;
                case clientTypes.NEUTRAL_SPHERO:
                    this.nbneutralSpheros -= 1
                    break;
                
                default:
                    break;
            }
            
        }) 
        
        this.spheroManager = new SpheroManager()

        
    }

}

module.exports = XpManager