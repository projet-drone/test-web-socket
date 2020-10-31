class Pupitre {
    name
    client

    constructor(name, client){
        this.name = name
        this.client = client
    }
    listenForJoystickConnection(spheroConnected){
       this.client.on("spheroDropped",name => {
           // console.log("dropped",name )
        spheroConnected(name)
       })  
    }
    listenForJoystickDisconnection(spheroConnected){
        this.client.on("spheroLifted",name => {
            // console.log("lifted",name )
         spheroConnected(name)
        })  
     }
}

module.exports = Pupitre;