import Notification from './notification';

class NotificationWeb extends Notification {
    /**
     *
     * @param onSucess
     * @param onFail
     */
    static setToken(onSucess, onFail) {
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
        this.config = config;
    }

    static config;
}
