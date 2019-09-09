import * as moment from 'moment';

import {Http, VersionCheck, Rollbar, HttpErrorHandler, Notification} from './index';

class AppBootstrap {

    static setup(client, version, envs, storage, callback, customEnv) {

        // Validate parans
        if (!client || ['web', 'mobile', 'admin'].indexOf(client) < 0)
            throw ('Unrecognized or undefined client: ' + client);
        if (typeof version === "object")
            throw ('version param should be just a string, like "1.2.3"');
        // @todo Validate envs
        // @todo Validate storage
        if (!callback || !callback.onMinVersionNotSatifies || !callback.onNewVersion || !callback.onUncaughtError)
            throw ('You must pass callback parameter to AppBootstrap.setup, with onMinVersionNotSatifies, onNewVersion and onUncaughtError methods.');
        AppBootstrap.callbacks = callback;

        const logs = [];
        // 1 - Decide env
        let nodeEnv = null;
        if (customEnv) {
            nodeEnv = customEnv;
            logs.push('Custom environment provided: ' + customEnv);
        } else {
            nodeEnv = process.env.NODE_ENV;
        }
        let firebase;
        let buildTime;
        let buildTimeString;
        if (client !== 'mobile') {
            firebase = process.env.FIREBASE && process.env.FIREBASE === true;
            buildTime = new Date(process.env.BUILD_TIME);
            buildTimeString = buildTime.toDateString() + ' ' + buildTime.toTimeString();
            logs.push('CLIENT: ' + client + ' - ENV: ' + nodeEnv + ' - VERSION: ' + version + ' - RELEASE DATE: ' + process.env.APP_RELEASE + ' - BUILD_TIME: ' + buildTimeString + ' - FIREBASE: ' + firebase);
        } else if (__DEV__ !== undefined) {
            logs.push('MOBILE CLIENT: ' + client + ' - ENV: ' + nodeEnv + ' - VERSION: ' + version);
        }

        let config;
        if (nodeEnv === 'development' && firebase) {
            config = envs['development_firebase'];
            // logs.push('> firebase development <');
        } else {
            config = envs[nodeEnv];
        }

        console.log(logs);
        console.log('Loaded config', config);
        if (config === undefined) {
            throw new Error('No config for NODE_ENV "' + nodeEnv + '"');
        }
        AppBootstrap.config = config;

        // 2 - Rollbar / bugsnag
        if (config.rollbarToken && client !== 'mobile') {
            Rollbar.setup(config.rollbarToken, client + '_' + nodeEnv, process.env.APP_VERSION, nodeEnv);
        } else if (client === 'mobile') {
            // Config of rollbar for native
            // console.log('AppBootstrap is not configuring the Rollbar, please check if other source is configuring it.');
        } else if (nodeEnv === 'development') {
            // console.warn('Rollbar not set on dev. It\'s ok.');
        } else {
            throw new Error('You must have Rollbar on your app.');
        }

        // 3 - Http
        Http.setBaseURL(config.baseUrl);
        Http.setup(version, client, nodeEnv, 'application/json');
        HttpErrorHandler.setup(callback);

        // 4 -  Moment
        moment.defineLocale('pt-br', require('moment/locale/pt-br'));

        // 5 - Version Check
        VersionCheck.setCurrentVersion(client, version);
        VersionCheck.onMinVersionNotSatifies(Http, callback.onMinVersionNotSatifies);
        VersionCheck.onNewVersion(storage).then(callback.onNewVersion);

        // // 6 - Capture errors onUncaught in AmActions
        // AMActions.onUncaughtError((e) => {
        //     if (e.message === 'Network request failed') {
        //         console.log('Network request failed, maybe you are offline');
        //     } else {
        //         console.error(e);
        //     }
        // });

        // 7 - Mobile fixes
        if (client === 'mobile') {
            if (nodeEnv === 'production') {
                // Remove logs on PROD (performance)
                console.log = function () {
                };
                console.info = function () {
                };
                console.warn = function () {
                };
                console.error = function () {
                };
                console.debug = function () {
                };
            }

            console.disableYellowBox = true;
        }

        // 8 - Notification
        if (config.notification) {
            Notification.setup(config.notification);
        }
        return true;

    }

    static onUncaughtError() {
        return AppBootstrap.callbacks.onUncaughtError;
    }

    static onMinVersionNotSatifies() {
        return AppBootstrap.callbacks.onMinVersionNotSatifies;
    }

    static onNewVersion() {
        return AppBootstrap.callbacks.onNewVersion;
    }

    static getConfig() {
        return AppBootstrap.config;
    }
}

AppBootstrap.callbacks = {};
AppBootstrap.config = null;

export default AppBootstrap;
