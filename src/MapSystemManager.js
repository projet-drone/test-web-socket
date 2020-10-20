var {MapSystem} = require('./model/MapSystem')
var {ClientHandler, clientTypes} = require('./ClientHandler')


class MapSystemManager {
    
    mapSystems = []
    
    init(){
        let mapSystemClients = ClientHandler.getinstance().findClientByType(clientTypes.MAP)
        
        mapSystemClients.forEach(mapSystem => {
            console.log("this is an app", mapSystem.name)


            let newmapSystem = new mapSystem(
                mapSystem.name,
                mapSystem.client
            )
            this.mapSystems.push(newmapSystem)
        });
    }

    findMapSystemByName(name){
        let mapSystemToReturn = null
        this.activities.forEach(mapSystem => {
            if(mapSystem.name == name){
                mapSystemToReturn = mapSystem
            }
        });
        return mapSystemToReturn
    }
    findMapSystemByName(name){
        let mapSystemToReturn = null
        this.activities.forEach(mapSystem => {
            if(mapSystem.name == name){
                mapSystemToReturn = mapSystem
            }
        });
        return mapSystemToReturn
    }
}

module.exports = MapSystemManager;