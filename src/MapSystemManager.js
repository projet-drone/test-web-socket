var MapSystem = require('./model/MapSystem')
var {ClientHandler, clientTypes} = require('./ClientHandler')


class MapSystemManager {
    
    mapSystems = []
    
    init(){
        let mapSystemClients = ClientHandler.getinstance().findClientByType(clientTypes.MAP)
        
        mapSystemClients.forEach(mapSystem => {
            // console.log("this is an app", mapSystem.name)


            let newmapSystem = new MapSystem(
                mapSystem.name,
                mapSystem.client
            )
            this.mapSystems.push(newmapSystem)
        });
    }

    findMapSystemByName(name){
        let mapSystemToReturn = null
        // console.log("/*/*//**//*/*/*/* */")
        // console.log(this.mapSystems)
        // console.log("/*/*//**//*/*/*/* */")
        this.mapSystems.forEach(mapSystem => {
            // console.log("/*/*/*/*/*/*/*/*/*/*/*/")
            // console.log(mapSystem.name)
            // console.log(name)
            // console.log("/*/*/*/*/*/*/*/*/*/*/*/")

            if(mapSystem.name == name){
                mapSystemToReturn = mapSystem
                 // console.log("/*/*/*/*/*/*/*/*/*/*/*/")
                 // console.log(mapSystemToReturn.name)
                 // console.log("/*/*/*/*/*/*/*/*/*/*/*/")

            }
        });
        return mapSystemToReturn
    }
    findallSystemsByNameAndType(name,type){
        let mapSystemToReturn = []
        this.mapSystems.forEach(mapSystem => {
            if(mapSystem.name.includes(name) && mapSystem.name.includes(type)){
                mapSystemToReturn.push(mapSystem); 
            }
        });
        return mapSystemToReturn
    }

    findallSystemsByName(name){
        let mapSystemToReturn = []
        this.mapSystems.forEach(mapSystem => {
            if(mapSystem.name.includes(name)){
                mapSystemToReturn.push(mapSystem); 
            }
        });
        return mapSystemToReturn
    }
}

module.exports = MapSystemManager;