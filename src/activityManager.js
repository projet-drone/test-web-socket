var {Activity} = require('./model/Activity')


class ActivityManager {
    
    activities
    

    findActivityByName(name){
        this.activities.forEach(activity => {
            if(activity.name == name){
                return Activity
            }
        });
    }
}

module.exports = ActivityManager;