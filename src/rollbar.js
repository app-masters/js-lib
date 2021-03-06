import rbar from './dependencies/rollbar';

var rollbar;

class Rollbar {
    static personSent;
    static personId;
    static personEmail;
    static personName;
    static logOnDev;
    static env;

    static setup(accessToken, env, version, logOnDev, nodeEnv) {
        Rollbar.logOnDev = logOnDev===true;
        Rollbar.env = nodeEnv;
        if (Rollbar.env ==='production' || Rollbar.logOnDev){
            rbar(accessToken, env, version, logOnDev===true, (instance) => {
                // console.log("rollbar setup done");
                rollbar = instance;
                Rollbar.sendPersonIfNeeded();
            });
        }
    }

    static log(message, payload, err, callback) {
        Rollbar.sendPersonIfNeeded();
        if (this.mustSend())
            rollbar.info(message, payload, err, callback);
        else {
            console.warn('Rollbar.log > Log would be sent to rollbar');
            console.error(err,message,payload);
        }
    }

    static info(message, payload, err, callback) {
        Rollbar.sendPersonIfNeeded();
        if (this.mustSend())
            rollbar.info(message, payload, err, callback);
        else {
            console.warn('Rollbar.info > Warning would be sent to rollbar');
            console.log(err,message,payload);
        }
    }

    static debug(message, payload, err, callback) {
        Rollbar.sendPersonIfNeeded();
        if (this.mustSend())
            rollbar.debug(message, payload, err, callback);
        else {
            console.warn('Rollbar.debug > Warning would be sent to rollbar');
            console.log(err,message,payload);
        }
    }

    static warning(err, message, payload, callback) {
        Rollbar.sendPersonIfNeeded();
        if (this.mustSend())
            rollbar.warning(message, payload, err, callback);
        else {
            console.warn('Rollbar.warning > Warning would be sent to rollbar');
            console.error(err,message,payload);
        }
    }

    static error(err, message, payload, callback) {
        Rollbar.sendPersonIfNeeded();
        if (this.mustSend())
            rollbar.error(err, message, payload, callback);
        else {
            console.warn('Rollbar.error > Error would be sent to rollbar');
            console.error(err);
        }
    }

    static critical(err, message, payload, callback) {
        Rollbar.sendPersonIfNeeded();
        if (this.mustSend())
            rollbar.critical(err, message, payload, callback);
        else {
            console.warn('Rollbar.critical > Error would be sent to rollbar');
            console.error(err);
        }
    }

    static setPerson(id, email, name) {
        Rollbar.personId = id;
        Rollbar.personEmail = email;
        Rollbar.personName = name;
        Rollbar.sendPersonIfNeeded();
    }

    static sendPerson() {
        if (!rollbar)
            return ; //console.error("rollbar not defined at sendPerson?")

        rollbar.configure({
            payload: {
                person: {
                    id: Rollbar.personId,
                    username: Rollbar.personName,
                    email: Rollbar.personEmail
                }
            }
        });
    }

    static sendPersonIfNeeded() {
        if (Rollbar.personId && !Rollbar.personSent)
            Rollbar.sendPerson();
    }

    /**
     * Tell if something must be sent to Rollbar
     * @returns {*|boolean}
     */
    static mustSend() {
        return (rollbar && (Rollbar.env !== 'development' || Rollbar.logOnDev));
    }
}

export default Rollbar;