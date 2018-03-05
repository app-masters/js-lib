import Http from './http';

class NotificationWeb {
    /**
     *
     * @param onSuccess
     * @param onFail
     */
    static getToken(onSuccess, onFail) {
        // first request the permission. Then returns de token
        this.messaging.requestPermission().then(() => {
            this.messaging.getToken().then((token) => {
                const notification = {
                    type: 'web',
                    value: token
                };
                onSuccess(notification);
            })
                .catch(onFail);
        }).catch((err) => {
            throw err;
        });
    }

    /**
     *
     * @param token
     */
    static setToken(token) {
        Http.post('/notification/token/', token).then((user) => {window.localStorage.setItem('auth', JSON.stringify(user))}).catch((err) => console.log(err));
    }

    /**
     *
     * @param user
     */
    static checkToken(user) {
        NotificationWeb.getToken((token) => {
            if (!user.notification || !user.notification.web.token.includes(token.value)) {
                NotificationWeb.setToken(token);
            }
        });
    }

    /**
     *
     * @param onSuccess
     * @param onFail
     */
    static handleMessage(onSuccess, onFail) {
        this.messaging.onMessage(onSuccess);
    }

    /**
     *
     * @param onSuccess
     * @param onFail
     */
    static onTokenRefresh(onSuccess, onFail) {
        this.messaging.onTokenRefresh(onSuccess, onFail);
    }

    /**
     *
     * @param firebase
     */
    static setup(firebase) {
        try {
            this.firebase = firebase;
            this.messaging = firebase.messaging();
            if (!this.messaging) {
                throw new Error('Notification.setup error: Messaging is missing');
            }
        } catch (error) {
            throw error;
        }
    }

    static firebase;
    static messaging;
}

export default NotificationWeb;
