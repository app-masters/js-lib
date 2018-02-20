class Notification {
    static platform;
    static notificationClass;
    static setPlatform(){
        if(typeof document != 'undefined'){
            if(System.platform.cordova) {
                this.platform = 'Cordova';
            }else{
                this.platform = 'Web';
            }
        }else if(typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
            this.platform = 'Native';
        }
        this.notificationClass = require(`./notification${this.platform}`);
    }
    static setup (config){
        this.setPlatform();
        this.notificationClass.setup(config);

    }
    static getToken(onSuccess, onFail){
        this.notificationClass.getToken(onSuccess, onFail);
    }

    ////////////////////
    static getMessage () {
        if (!System.platform.cordova) {
            messaging.onMessage(function (payload) {
                console.log('onMessage: ', payload);
            });
        }
    }

    static onTokenRefresh (onSuccess, onFail) {
        this.notificationClass.onNotificationOpen()
        /*
            cordova implementation
            window.FirebasePlugin.onTokenRefresh(onSuccess, onFail);

            web implementation
            messaging.onTokenRefresh(onSuccess, onFail);
        */
    }

    static onNotificationOpen (onSuccess, onFail) {
        this.notificationClass.onNotificationOpen(onSuccess, onFail);
        /*
            cordova implementation
            window.FirebasePlugin.onNotificationOpen(onSuccess, onFail);
        */
    }
}

export default Notification;
