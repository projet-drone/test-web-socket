var {ClientHandler,clientTypes} = require('./ClientHandler')
var RoomManager = require('./RoomManager')
var SpheroManager = require('./SpheroManager')
var ActivityManager = require('./ActivityManager')
var WebAppsManager = require('./WebAppsManager')
var MapSystemManager = require('./MapSystemManager')
var {Sphero, SpheroMods} = require('./model/Sphero')
var Activity = require('./model/Activity')
var WebApp = require('./model/WebApp')

class XpManager{

    roomManager;
    spheroManager;
    mapManager;
    activityManager;
    webAppsManager;
    mapSystemManager;

    experienceHasBegun = false
    nbInventorSpheros = 0
    nbWebApps = 0
    nbMapSystems = 0

    expectedInventorSpheroNumber = 3
    excpectedWebApps = 2
    excpectedMapSystems = 5

    activityDone = []

    unlockedInventors = []

    
    init(){
        ClientHandler.getinstance().listenForConnections((newClientConnected) => {

            if (newClientConnected.type == clientTypes.SPHERO) {
                this.nbInventorSpheros += 1
                console.log('nbInventorSpheros',this.nbInventorSpheros)
            }
            if (newClientConnected.type == clientTypes.DISPLAY) {
                this.nbWebApps += 1
                console.log('nbWebApps',this.nbWebApps)
            }
            if (newClientConnected.type == clientTypes.MAP) {
                this.nbMapSystems += 1
                console.log('nbMapSystems',this.nbMapSystems)
            }
            console.log("///////////////////////////////////////")
            console.log("///////////////////////////////////////")
            console.log("inventors : " + this.nbInventorSpheros + "/" + this.expectedInventorSpheroNumber )
            console.log("webapps : " + this.nbWebApps + "/" + this.excpectedWebApps )
            console.log("mapSystems : " + this.nbMapSystems + "/" + this.excpectedMapSystems )
            console.log("///////////////////////////////////////")
            console.log("///////////////////////////////////////")

            if (this.nbInventorSpheros == this.expectedInventorSpheroNumber && this.nbWebApps == this.excpectedWebApps && this.nbMapSystems == this.excpectedMapSystems){

                //initialisation des différents managers
                this.spheroManager.init()
                this.webAppsManager.init()
                this.mapSystemManager.init()

                //déclarations des différentes activités de l'experience
                this.declareExperienceActivities()
                

                //écoute la connexion éventuelle d'un sphéro en mode Joystick ==> correspond a une volonté de se déplacer de bubulle en bubulle
                this.spheroManager.listenForJoystickConnection((sphero) => {
                    if(this.experienceHasBegun){
                        console.log("===================================")
                        console.log("sphero " + sphero.name + " connected as Joystick")
                        console.log("===================================")
                        //active le sphéro en question
                        this.spheroManager.activate(sphero)
                        sphero.client.emit('waitingForJoystickData')
                        let skillTreeWebApp = this.webAppsManager.findWebAppByName("SkillTreeWebApp")
                        
                        ClientHandler.getinstance().collapseSocketTunnel("sendJoystickDatas")
                       
                        //appeler la fonction de transfere des données du sphéro au client web
                        ClientHandler.getinstance().createSocketTunnel(sphero,skillTreeWebApp,"sendJoystickDatas")
                    }
                })


                let skillTreeWebApp = this.webAppsManager.findWebAppByName("SkillTreeWebApp")
                //écouter l'appweb si une activité dois commencer ==> l'utlisateur a clické sur une bubulle d'experience
                skillTreeWebApp.client.on("launchActivity",(activityName) => {
                    ClientHandler.getinstance().collapseSocketTunnel("sendJoystickDatas")
                    let activity = this.activityManager.findActivityByName(activityName)
                    console.log("===================================")
                    console.log(activityName + " launched")
                    console.log("===================================")

                    console.log(activity)

                    activity.activityCore().then((result) => {
                        //code a executer quand l'activité est finie
                        this.activityDone.push(activityName)

                        console.log(this.activityDone)

                        console.log("===================================")
                        console.log(activityName + " finished")
                        console.log("===================================")

                        //reswitch les sphero dans le bon mode
                        this.spheroManager.switchSpheroMod(activity.actorSphero,SpheroMods.JOYSTICK)
                        
                    })

                })

                //a changer
                skillTreeWebApp.client.on("unlockSphero",(spheroName) => {
                    let spheroToUnlock = this.spheroManager.findSpheroByName(spheroName)
                    this.spheroManager.unlock(spheroToUnlock)
                    this.spheroManager.activate(spheroToUnlock) 
                    this.spheroManager.switchSpheroMod(spheroToUnlock,SpheroMods.PROXIMITY_DETECTOR, () => {
                        spheroToUnlock.client.on("gotCloseToEmitter",() => {
                            this.spheroManager.disable(spheroToUnlock)
                            this.unlockedInventors.push(spheroName)

                            console.log("===================================")
                            console.log(spheroName + " captured !!")
                            console.log("===================================")
                            //TODO: emit un event pour allumer les lumières
                            //TODO: jouer un son
                        })
                    })

                })


                //experience start
                console.log("===================================")
                console.log("experience started")
                console.log("===================================")
                let edisonSphero = this.spheroManager.findSpheroByName("Edison")
                
                this.spheroManager.unlock(edisonSphero)
                this.unlockedInventors.push(edisonSphero)

                this.spheroManager.activate(edisonSphero) 
                this.spheroManager.switchSpheroMod(edisonSphero,SpheroMods.PROXIMITY_DETECTOR, () => {

                    console.log("===================================")
                    console.log("edison proximity detector mod")
                    console.log("===================================")

                    edisonSphero.client.on("gotCloseToEmitter",() => {
                        this.spheroManager.disable(edisonSphero)
                        this.experienceHasBegun = true
                        

                        console.log("===================================")
                        console.log("edison captured !! experience began")
                        console.log("===================================")

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
                    case clientTypes.DISPLAY:
                        this.nbWebApps -= 1
                        break;
                    case clientTypes.MAP:
                        this.nbMapSystems -= 1
                        break;
                default:
                    break;
            }
            
        }) 
        
        this.spheroManager = new SpheroManager()
        this.webAppsManager = new WebAppsManager()
        this.activityManager = new ActivityManager()
        this.mapSystemManager = new MapSystemManager()
        
        
    }

    declareExperienceActivities(){
        
        /**
         * déclaration de l'activité de la machine a courant continu
         */
        let DCGeneratorActivity = new Activity()
        DCGeneratorActivity.name = "ContinuousGeneratorActivity"
        
        //definition de ce qu'il se passe pendant l'activité
        DCGeneratorActivity.activityCore = () => {
            let actorSphero = this.spheroManager.findSpheroByName("Edison")
            DCGeneratorActivity.actorSphero = actorSphero
            let skillTreeWebApp = this.webAppsManager.findWebAppByName("SkillTreeWebApp")
           
            //mettre les sphero et tout et tout dans le bon mode
            //this.spheroManager.activate(actorSphero)

            this.spheroManager.switchSpheroMod(actorSphero,SpheroMods.DC_GENERATOR,() => {

                this.spheroManager.activate(actorSphero)

                //écoute les datas envoyés par le bon sphero et les retransmet a la bonne webApp
                ClientHandler.getinstance().createSocketTunnel(actorSphero,skillTreeWebApp,"sendContinuousData")
            })

            
           

            //écouter la fin de l'activitée
            const endedActivityPromise = new Promise((resolve,reject) => {

                //eventuellent l'écran qui envoie cet event
                skillTreeWebApp.client.on('DCgeneratorActivityCompleted',() => {

                    let lightMapSystem = this.mapSystemManager.findMapSystemByName("light") 
                    lightMapSystem.client.emit("edisonCompleted")

                    let motorsMapSystems = this.mapSystemManager.findallSystemsByNameAndType("motor","near")
                    motorsMapSystems.forEach(MapmotorSystem => {
                        MapmotorSystem.client.emit("edisonCompleted")
                    });

                    ClientHandler.getinstance().collapseSocketTunnel("sendContinuousData")
                    resolve('finished')
                })
            })
            return endedActivityPromise
        }


        /**
         * déclaration de l'activité du générateur alternatif
         */
        let ACGeneratorActivity = new Activity()
        ACGeneratorActivity.name = "AlternativeGeneratorActivity"
        
        //definition de ce qu'il se passe pendant l'activité
        ACGeneratorActivity.activityCore = () => {
            let actorSphero = this.spheroManager.findSpheroByName("Westinghouse")
            let skillTreeWebApp = this.webAppsManager.findWebAppByName("SkillTreeWebApp")
            ACGeneratorActivity.actorSphero = actorSphero
           
            //mettre les sphero et tout et tout dans le bon mode
            this.spheroManager.switchSpheroMod(actorSphero,SpheroMods.AC_GENERATOR,() => {
                
                this.spheroManager.activate(actorSphero)
                //écoute les datas envoyés par le bon sphero et les retransmet a la bonne webApp
                ClientHandler.getinstance().createSocketTunnel(actorSphero,skillTreeWebApp,"sendAlternativeData")
            })

            //écouter la fin de l'activitée
            const endedActivityPromise = new Promise((resolve,reject) => {

                //eventuellent l'écran qui envoie cet event
                skillTreeWebApp.client.on('ACgeneratorActivityCompleted',() => {

                    let lightMapSystem = this.mapSystemManager.findMapSystemByName("light") 
                    lightMapSystem.client.emit("westinghouseCompleted")

                    ClientHandler.getinstance().collapseSocketTunnel("sendAlternativeData")
                    resolve('finished')
                })
            })
            return endedActivityPromise
        }

        /**
         * déclaration de l'activité du Moteur te Tesla
         */
        let motorActivity = new Activity()
        motorActivity.name = "MotorActivity"

        //definition de ce qu'il se passe pendant l'activité
        motorActivity.activityCore = () => {
            let actorSphero = this.spheroManager.findSpheroByName("Tesla")
            let motorWebApp = this.webAppsManager.findWebAppByName("MotorWebApp")
            motorActivity.actorSphero = actorSphero
           
            //mettre les sphero et tout et tout dans le bon mode
            this.spheroManager.switchSpheroMod(actorSphero,SpheroMods.MOTOR,() => {
            
                this.spheroManager.activate(actorSphero)
                //tunnel entre le sphéro et l'app web
                ClientHandler.getinstance().createSocketTunnel(actorSphero,motorWebApp,"sendMotorData")
            
            })
            
            //écouter la fin de l'activitée
            const endedActivityPromise = new Promise((resolve,reject) => {

                //eventuellent l'écran qui envoie cet event
                motorWebApp.client.on('MotorActivityCompleted',() => {

                    let lightMapSystem = this.mapSystemManager.findMapSystemByName("light") 
                    lightMapSystem.client.emit("teslaCompleted")

                    let motorsMapSystems = this.mapSystemManager.findallSystemsByName("motor")
                    motorsMapSystems.forEach(MapmotorSystem => {
                        MapmotorSystem.client.emit("teslaCompleted")
                    });

                    ClientHandler.getinstance().collapseSocketTunnel("sendAlternativeData")
                    resolve('finished')
                })
            })
            return endedActivityPromise
        }

        this.activityManager.activities.push(DCGeneratorActivity)
        this.activityManager.activities.push(ACGeneratorActivity)
        this.activityManager.activities.push(motorActivity)



    }


}

module.exports = XpManager