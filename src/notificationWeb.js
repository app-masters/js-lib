import Notification from './notification';

class NotificationWeb extends Notification {
    static config;

    setup(config) {
        this.config = config;
    }

    getToken(onSucess, onFail) {
        messaging.getToken()
            .then(onSuccess)
            .catch(onFail);
    }
}
