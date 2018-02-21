import Notification from './notification';

class NotificationWeb extends Notification {
    /**
     *
     * @param onSucess
     * @param onFail
     */
    static setToken(onSucess, onFail) {
        messaging.getToken()
            .then(onSuccess)
            .catch(onFail);
    }

    /**
     *
     * @param onSuccess
     * @param onFail
     */
    static handleMessage(onSuccess, onFail) {
        messaging.onMessage(onSuccess);
    }

    /**
     *
     * @param onSuccess
     * @param onFail
     */
    static onTokenRefresh(onSuccess, onFail) {
        messaging.onTokenRefresh(onSuccess, onFail);
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
