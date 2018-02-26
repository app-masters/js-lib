class NotificationCordova {
    /**
     *
     * @param onSuccess
     * @param onFail
     */
    static getToken(onSuccess, onFail) {
        window.FirebasePlugin.getToken(onSuccess, onFail);
    }

    /**
     *
     * @param onSuccess
     * @param onFail
     */
    static handleMessage(onSuccess, onFail) {
        window.FirebasePlugin.onNotificationOpen(onSuccess, onFail);
    }

    /**
     *
     * @param onSuccess
     * @param onFail
     */
    static onTokenRefresh(onSuccess, onFail) {
        window.FirebasePlugin.onTokenRefresh(onSuccess, onFail);
    }

    /**
     *
     * @param config
     */
    static setup(config) {
        if (!window.FirebasePlugin) {
            throw new Error('Notification.setup error: FirebasePlugin is missing');
        }
        this.config = config;
    }

    static config;
}

export default NotificationCordova;
