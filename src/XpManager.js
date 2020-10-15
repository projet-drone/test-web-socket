var {ClientHandler,clientTypes} = require('./ClientHandler')
var RoomManager = require('./RoomManager')
var SpheroManager = require('./SpheroManager')
var ActivityManager = require('./ActivityManager')
var {Sphero, SpheroMods} = require('./model/Sphero')
var Activity = require('./model/Activity')

class XpManager{
    roomManager;
    spheroManager;
    mapManager;
    activityManager;

    experienceHasBegun = false
    nbInventorSpheros = 0

    expectedInventorSpheroNumber = 3


    
    init(){
        ClientHandler.getinstance().listenForConnections((newClientConnected) => {

            if (newClientConnected.type == clientTypes.SPHERO) {
                this.nbInventorSpheros += 1
                console.log('nbInventorSpheros',this.nbInventorSpheros)
            }

            if (this.nbInventorSpheros == this.expectedInventorSpheroNumber){

                this.spheroManager.init()
                this.activityManager.declareExperienceActivities()
                
                this.spheroManager.listenForJoystickConnection((sphero) => {
                    if(experienceHasBegun){
                        this.spheroManager.activate(sphero)
                        sphero.client.emit('waitingForJoystickData')

                        //appeller la fonction de transfere des données du sphéro au client web

                        //écouter l'appweb si une activité dois commencer
                        monAppWeb.client.on("launchActivity",(activityName) => {
                            let activity = this.activityManager.findActivityByName(activityName)

                            activity.activityCore().then((result) => {
                                //code a executer quand l'activité est finie
                                //reswitch les sphero dans le bon mode
                                
                            })

                        })

                    }
                })

                let edisonSphero = this.spheroManager.findSpheroByName("Edison")
                let westinghouseSphero = this.spheroManager.findSpheroByName("Westinghouse")
                let teslaSphero = this.spheroManager.findSpheroByName("Tesla")

                this.spheroManager.activate(edisonSphero) 
                this.spheroManager.switchSpheroMod(edisonSphero,SpheroMods.PROXIMITY_DETECTOR, () => {
                    edisonSphero.client.on("gotCloseToEmitter",() => {
                        this.spheroManager.disable(edisonSphero)
                        experienceHasBegun = true
                        //TODO: emit un event pour allumer les lumières
                        //TODO: jouer un son
                    })
                })
                
                // this.spheroManager.activate(this.spheroManager.spheros[0])
                // this.spheroManager.activate(this.spheroManager.spheros[1])
                // this.spheroManager.activate(this.spheroManager.spheros[2])

            }
        },
        (clientToDelete) => {
            
            console.log("switchType",clientToDelete.client.type)
            switch (clientToDelete.client.type) {
                case clientTypes.SPHERO:
                    this.nbInventorSpheros -= 1
                    break;
                
                default:
                    break;
            }
            
        }) 
        
        this.spheroManager = new SpheroManager()

        
    }

    declareExperienceActivities(){
        
        let DCGeneratorActivity = new Activity()

        DCGeneratorActivity.name = "ContinuousGeneratorActivity"
        DCGeneratorActivity.activityCore = () => {
            let actorSphero = this.spheroManager.findSpheroByName("Edison")
           
            //mettre les sphero et tout et tout dans le bon mode
            //écouter les cercles et la vitesse de rotation
            //transférer les datas a l'app web

            //écouter la fin de l'activitée
            const endedActivityPromise = new Promise((resolve,reject) => {

                //eventuellent l'écran qui envoie cet event
                actorSphero.client.on('generatorActivityCompleted',() => {
                    resolve('finished')
                })
            })
            return endedActivityPromise
        }

    }


}

module.exports = XpManager