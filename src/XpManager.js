var {Observable } = require('rxjs')

var {ClientHandler,clientTypes} = require('./ClientHandler')
var RoomManager = require('./RoomManager')
var SpheroManager = require('./SpheroManager')
var ActivityManager = require('./ActivityManager')
var WebAppsManager = require('./WebAppsManager')
var MapSystemManager = require('./MapSystemManager')
var {Sphero, SpheroMods} = require('./model/Sphero')
var Activity = require('./model/Activity')
var WebApp = require('./model/WebApp')
var Pupitre = require('./model/Pupitre')

class XpManager{

    roomManager;
    spheroManager;
    mapManager;
    activityManager;
    webAppsManager;
    mapSystemManager;

    pupitre;
    master;

    experienceHasBegun = false
    nbInventorSpheros = 0
    nbWebApps = 0
    nbMapSystems = 0

    expectedInventorSpheroNumber = 3
    excpectedWebApps = 2
    excpectedMapSystems = 5

    activityDone = []

    unlockedInventors = []

    pendingActivity = false

    
    init(){

        const connectionObserver = ClientHandler.getinstance().observeConnections.subscribe(newClientConnected => {

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
            if (newClientConnected.name == "Pupitre") {
                this.pupitre = new Pupitre("theOnlyPupitre",newClientConnected.client)
            }
            if (newClientConnected.name == "Master") {
                this.master = newClientConnected
                this.launchExperience()
                
            }
            console.log("///////////////////////////////////////")
            console.log("///////////////////////////////////////")
            console.log("inventors : " + this.nbInventorSpheros + "/" + this.expectedInventorSpheroNumber )
            console.log("webapps : " + this.nbWebApps + "/" + this.excpectedWebApps )
            console.log("mapSystems : " + this.nbMapSystems + "/" + this.excpectedMapSystems )
            console.log("///////////////////////////////////////")
            console.log("///////////////////////////////////////")

            newClientConnected.client.on('disconnect', () => {
                console.log("clientToDisconnect",newClientConnected);
                let clientToDelete = newClientConnected
               
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
    
                ClientHandler.getinstance().clients.splice(clientToDelete.index,1)
                console.log("disconnected")
                //console.log("test")
            })
        })

        
        this.spheroManager = new SpheroManager()
        this.webAppsManager = new WebAppsManager()
        this.activityManager = new ActivityManager()
        this.mapSystemManager = new MapSystemManager()

        
        
    }
    
    launchExperience(){
        if (this.master){
            this.master.client.on("startExperience",() => {
    
                //initialisation des différents managers
                this.spheroManager.init()
                this.webAppsManager.init()
                this.mapSystemManager.init()
    
                //déclarations des différentes activités de l'experience
                this.declareExperienceActivities()
                
    
                //écoute la connexion éventuelle d'un sphéro en mode Joystick ==> correspond a une volonté de se déplacer de bubulle en bubulle
                this.pupitre.listenForJoystickConnection((spheroName) => {
                    let sphero = this.spheroManager.findSpheroByName(spheroName)
                    if(this.unlockedInventors.includes(spheroName)){
                        console.log("===================================")
                        console.log("sphero " + sphero.name + " connected as Joystick")
                        console.log("===================================")
                        //active le sphéro en question
                        this.spheroManager.activate(sphero)
                        //sphero.client.emit('waitingForJoystickData')
                        this.spheroManager.switchSpheroMod(sphero,SpheroMods.JOYSTICK)

                        let skillTreeWebApp = this.webAppsManager.findWebAppByName("SkillTreeWebApp")
                        
                        ClientHandler.getinstance().collapseSocketTunnel("sendJoystickDatas")
                       
                        //appeler la fonction de transfere des données du sphéro au client web
                        ClientHandler.getinstance().createSocketTunnel(sphero,skillTreeWebApp,"sendJoystickDatas")
                    }
                })
    
                this.pupitre.listenForJoystickDisconnection((spheroName) => {
                    console.log("disconnectedJoystick")
                    let sphero = this.spheroManager.findSpheroByName(spheroName)
                    if (this.unlockedInventors.includes(spheroName) && !this.pendingActivity) {
                        this.spheroManager.switchSpheroMod(sphero,SpheroMods.IDLE)
                    }
                    ClientHandler.getinstance().collapseSocketTunnelBySphero(sphero,"sendJoystickDatas")
                })
    
                let skillTreeWebApp = this.webAppsManager.findWebAppByName("SkillTreeWebApp")
                //écouter l'appweb si une activité dois commencer ==> l'utlisateur a clické sur une bubulle d'experience
                skillTreeWebApp.client.on("launchActivity",(activityName) => {
                    ClientHandler.getinstance().collapseSocketTunnel("sendJoystickDatas")
                    let activity = this.activityManager.findActivityByName(activityName)
                    this.pendingActivity = true
                    console.log("===================================")
                    console.log(activityName + " launched")
                    console.log("===================================")
    
                    console.log(activity)
    
                    const waitForValidation = new Observable((subscriber) => {
                        this.pupitre.client.on("spheroLifted",data => {
                            console.log("do you even lift ?")
                            subscriber.next("lifted")
                        })
                        activity.actorSphero.client.on("spheroShaked",data => {
                            console.log("drop da bass")
                            subscriber.next("shaked")
                        })
                    })
    
                    let completedTasks = []
                    const validationObserver = waitForValidation.subscribe((observer) =>{
                        completedTasks.push(observer)
    
                        if (completedTasks.includes("lifted") /*&& completedTasks.includes("shaked")*/){

                            console.log("===================================")
                            console.log(activityName + " launched")
                            console.log("===================================")

                            console.log("test")
                            activity.activityCore().then((result) => {
                                //code a executer quand l'activité est finie
                                this.activityDone.push(activityName)
                                this.pendingActivity = false
                                console.log(this.activityDone)
                                console.log("testsetset")
        
                                console.log("===================================")
                                console.log(activityName + " finished")
                                console.log("===================================")
                                validationObserver.unsubscribe()
                                //reswitch les sphero dans le bon mode
                                this.spheroManager.switchSpheroMod(activity.actorSphero,SpheroMods.IDLE)
                                
                            })
                        }
                    })
    
                    
    
                })
    
                //a changer
    
                
    
                this.pupitre.client.on("spheroLifted",(spheroName) => {
                    if (!this.unlockedInventors.includes(spheroName)) {
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
                    }
    
                })
    
    
                //experience start
                console.log("===================================")
                console.log("experience started")
                console.log("===================================")
            
    
            })
            }

    }

    declareExperienceActivities(){
        
        /**
         * déclaration de l'activité de la machine a courant continu
         */
        let DCGeneratorActivity = new Activity()
        DCGeneratorActivity.name = "ContinuousGeneratorActivity"
        
        let actorSphero = this.spheroManager.findSpheroByName("Edison")
        DCGeneratorActivity.actorSphero = actorSphero

        //definition de ce qu'il se passe pendant l'activité
        DCGeneratorActivity.activityCore = () => {
           
            let skillTreeWebApp = this.webAppsManager.findWebAppByName("SkillTreeWebApp")
           
            //mettre les sphero et tout et tout dans le bon mode
            //this.spheroManager.activate(actorSphero)

            this.spheroManager.switchSpheroMod(DCGeneratorActivity.actorSphero,SpheroMods.DC_GENERATOR,() => {

                this.spheroManager.activate(DCGeneratorActivity.actorSphero)

                //écoute les datas envoyés par le bon sphero et les retransmet a la bonne webApp
                ClientHandler.getinstance().createSocketTunnel(DCGeneratorActivity.actorSphero,skillTreeWebApp,"sendContinuousData")
            })

            
           

            //écouter la fin de l'activitée
            const endedActivityPromise = new Promise((resolve,reject) => {

                //eventuellent l'écran qui envoie cet event
                skillTreeWebApp.client.on('DCgeneratorActivityCompleted',() => {

                    console.log("activity finie")


                    let lightMapSystem = this.mapSystemManager.findMapSystemByName("light") 
                    //lightMapSystem.client.emit("edisonCompleted")

                    let motorsMapSystems = this.mapSystemManager.findallSystemsByNameAndType("motor","near")
                    motorsMapSystems.forEach(MapmotorSystem => {
                        //MapmotorSystem.client.emit("edisonCompleted")
                    });

                    //ClientHandler.getinstance().collapseSocketTunnel("sendContinuousData")
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
        
        actorSphero = this.spheroManager.findSpheroByName("Westinghouse")
        ACGeneratorActivity.actorSphero = actorSphero

        //definition de ce qu'il se passe pendant l'activité
        ACGeneratorActivity.activityCore = () => {
            let skillTreeWebApp = this.webAppsManager.findWebAppByName("SkillTreeWebApp")
            
           
            //mettre les sphero et tout et tout dans le bon mode
            this.spheroManager.switchSpheroMod(ACGeneratorActivity.actorSphero,SpheroMods.AC_GENERATOR,() => {
                
                this.spheroManager.activate(ACGeneratorActivity.actorSphero)
                //écoute les datas envoyés par le bon sphero et les retransmet a la bonne webApp
                ClientHandler.getinstance().createSocketTunnel(ACGeneratorActivity.actorSphero,skillTreeWebApp,"sendAlternativeData")
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

        actorSphero = this.spheroManager.findSpheroByName("Tesla")
        motorActivity.actorSphero = actorSphero
           
        //definition de ce qu'il se passe pendant l'activité
        motorActivity.activityCore = () => {
            let motorWebApp = this.webAppsManager.findWebAppByName("MotorWebApp")
           
            //mettre les sphero et tout et tout dans le bon mode
            this.spheroManager.switchSpheroMod(motorActivity.actorSphero,SpheroMods.MOTOR,() => {
            
                this.spheroManager.activate(motorActivity.actorSphero)
                //tunnel entre le sphéro et l'app web
                ClientHandler.getinstance().createSocketTunnel(motorActivity.actorSphero,motorWebApp,"sendMotorData")
            
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