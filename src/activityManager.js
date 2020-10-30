var {Activity} = require('./model/Activity')


class ActivityManager {
    
    activities = []
    

    findActivityByName(name){
        let activityToReturn = null
        this.activities.forEach(activity => {
            if(activity.name == name){
                activityToReturn = activity
            }
        });
        return activityToReturn
    }
}

module.exports = ActivityManager;