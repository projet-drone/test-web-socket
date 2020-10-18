var WebApp = require('./model/WebApp')
var {ClientHandler, clientTypes} = require('./ClientHandler')


class WebAppManager {
    
    webApps = []
    
    init(){
        let webAppClients = ClientHandler.getinstance().findClientByType(clientTypes.DISPLAY)
        
        webAppClients.forEach(webApp => {
            console.log("this is an app", webApp.name)
            let newWebApp = new WebApp(
                webApp.name,
                webApp.client
            )
            this.webApps.push(newWebApp)
        });
    }
    
    findWebAppByName(name){
        let webappToReturn = null

        this.webApps.forEach(webApp => {
            if(webApp.name == name){
                webappToReturn = webApp
            } 
        });
        return webappToReturn
    }
}

module.exports = WebAppManager;