
const SpheroMods = {
    JOYSTICK : "joystick",
    GENERATOR : "generator",
    PROXIMITY_DETECTOR : "memoryVacuum",
    MOTOR : "display",
}

class Sphero {
    name
    type
    mode
    client
    state

    constructor(name, type, mode, client, state){
        this.name = name
        this.type = type
        this.mode = mode
        this.client = client
        this.state = state
    }

    activate(){
        this.state = "active"
        this.client.emit("activate")

        //TODO: changer l'éclairage de la pièce
    }
    disable(){
        this.state = "idle"
        this.client.emit("disable")
    }
    switchMode(mod,modSwitched){
        this.mode = mod
        modSwitched()
    }
}



module.exports = {Sphero,SpheroMods};