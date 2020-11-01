class XpTracker{
    trackedClients = {
        spheros:[],
        webApps:[],
        mapSystems:[],
        systems:[]

    }

    doneActivities = []

    unlockedNodes = []

    trackSphero(name){
        let newTrackedSphero = {
            name,
            currentMode:"locked",
            hasAlreadyConnected:false,
            
        }
    }
}

module.exports = XpTracker