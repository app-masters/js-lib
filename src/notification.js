import NotificationWeb from './notificationWeb';
import NotificationCordova from './notificationCordova';

class Notification {
    /**
     *
     * @param onSuccess
     * @param onFail
     */
    static getToken(onSuccess, onFail) {
        this.notificationClass.getToken(onSuccess, onFail);
    }

    /**
     *
     * @param user
     */
    static checkToken(user){
        this.notificationClass.checkToken(user);
    }
    /**
     *
     * @param onSuccess
     * @param onFail
     */
    static handleMessage(onSuccess, onFail) {
        this.notificationClass.handleMessage(onSuccess, onFail);
    }

    /**
     * @param onSuccess
     * @param onFail
     */
    static onTokenRefresh(onSuccess, onFail) {
        this.notificationClass.onTokenRefresh(onSuccess, onFail);
    }

    /**
     * Method used to set the all device information (platform and os)
     * throws an error when couldn't find the platform or the os
     */
    static setDevice() {
        /*if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
            this.device.platform = 'native';
            this.notificationClass = require(`./notificationNative`);
        }else*/
        if (!document.URL.startsWith('http')) {
            this.device.platform = 'cordova';
            this.notificationClass = NotificationCordova;
        } else {
            this.device.platform = 'web';
            this.notificationClass = NotificationWeb;
        }
        if (this.device.platform === null) {
            throw new Error(`Couldn't find the current Platform`);
        }
        if (this.device.os === null) {
            // the os must be implemented yet
            // throw new Error(`Couldn't find the current OS`);
        }
    }

    /**
     * Method to setup the Notification class.
     * it sets the device information and the current class that will be implemented
     * @param config
     */
    static setup(config) {
        try {
            this.setDevice();
            this.notificationClass.setup(config);
        } catch (error) {
            throw error;
        }
    }

    /**
     * the all device information needed
     * os: 'ios, android' - platform: 'web', 'native', 'cordova'
     * @type {{platform: null, os: null}}
     */
    static device = {
        platform: null,
        os: null
    };
    static notificationClass;
}

export default Notification;
