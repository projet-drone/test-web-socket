var Light = require('./model/Light')
const axios = require('axios');
var {ClientHandler, clientTypes} = require('./ClientHandler')


class RoomManager {
    

    lights = []
    master;

    init(){
        let lightClients = ClientHandler.getinstance().findClientByType(clientTypes.LIGHT)
        console.log("lightClients", lightClients)
        lightClients.forEach(client => {
            //console.log("this is a sphero", sphero.name)
            let newLight = new Light(
                client.name,
                client.type,
                client.client
            )
            this.lights.push(newLight)
            console.log("newLight", newLight)
        });
        
    }

    changeAmbiantColor(inventorName){
        let hueValue = 0;
        console.log("inAmbiantColor", inventorName)
        this.lights.forEach((light) => {
            console.log("light","****************************************")
            
            switch (inventorName) {
                case "Edison":
                    light.client.emit("edisonCompleted");
                    break;
                case "Westinghouse":
                    light.client.emit("westinghouseCompleted");
                    break;
                case "Tesla":
                    light.client.emit("teslaCompleted");
                    break;
                default:
                    break;
            }
        })
        switch (inventorName) {
            case "Edison":
                hueValue = 100
                console.log("HUE value :", hueValue)
                this.master.client.emit("lightPhilipsHue",hueValue)
                

                break;
            case "Westinghouse":
                hueValue = 50000
                console.log("HUE value :", hueValue)
                this.master.client.emit("lightPhilipsHue",hueValue)
                break;
            case "Tesla":
                hueValue = 40000
                console.log("HUE value :", hueValue)
                this.master.client.emit("lightPhilipsHue",hueValue)

                break;
            default:
                break;
        }
        
        /*axios.put('https://192.168.8.109/api/Ynfv-hJ0vh0LZCTevecUMGvhcv6DJmyNW9K68Inv/lights/1/state', 
        {"on":true, "sat":254, "bri":254,"hue":10000})
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });*/

    }

    lessLight(){
        this.master.client.emit("reduceLight",127)
    }

    playMapSound(type){
        if(type == "motor"){
            this.playSound("mapWithMotor")
        }else{
            this.playSound("mapLight")

        }
    }

    playInventorCapture(inventorName){
        let hueValue = 0;
        this.master.client.emit("playSound",inventorName)
        switch (inventorName) {
            case "Edison":
                hueValue = 100
                console.log("HUE value :", hueValue)
                this.master.client.emit("playCaptureLightEffect",{brightness:127 ,hue:hueValue})
                this.playSound("inventorEdisonCapture")
                break;
            case "Westinghouse":
                hueValue = 50000
                console.log("HUE value :", hueValue)
                this.master.client.emit("playCaptureLightEffect",{brightness:127 ,hue:hueValue})
                this.playSound("inventorCapture")

                break;
            case "Tesla":
                hueValue = 40000
                console.log("HUE value :", hueValue)
                this.master.client.emit("playCaptureLightEffect",{brightness:127 ,hue:hueValue})
                this.playSound("inventorCapture")
                break;
            default:
                break;
        }
    }



    playSound(soundName){
        this.master.client.emit("playSound",soundName)
    }
}

module.exports = RoomManager;