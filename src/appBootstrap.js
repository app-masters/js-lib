import * as moment from 'moment';

import Http from './http';
import Rollbar from './rollbar';
import VersionCheck from './version';
import HttpErrorHandler from './httpErrorHandler';
import Notification from './notification';

class AppBootstrap {

    static setup(client, platform, version, envs, storage, callback, customEnv) {

        // Validate parans
        if (!client || ['web', 'mobile', 'admin'].indexOf(client) < 0)
            throw ('AppBootstrap.setup - Unrecognized or undefined client: ' + client);
        if (client === 'web' && platform !== 'web')
            throw ('AppBootstrap.setup - Platform should be "web" when client is "web"');
        if (!platform || ['web', 'android', 'ios'].indexOf(platform) < 0)
            throw ('AppBootstrap.setup - Unrecognized or undefined platform: ' + platform + ' - should be one of: web, android, ios');
        if (client === 'mobile' && ['android', 'ios'].indexOf(platform) < 0)
            throw ('AppBootstrap.setup - Mobile platform should be one of: android, ios');
        if (typeof version === "object")
            throw ('AppBootstrap.setup - Version param should be just a string, like "1.2.3"');
        // @todo Validate envs
        // @todo Validate storage
        if (!callback || !callback.onMinVersionNotSatifies || !callback.onNewVersion || !callback.onUncaughtError)
            throw ('AppBootstrap.setup - You must pass callback parameter, with onMinVersionNotSatisfies, onNewVersion and onUncaughtError methods.');
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
            if (process.env.BUILD_TIME) {
                buildTime = new Date(process.env.BUILD_TIME);
                buildTimeString = buildTime.toDateString() + ' ' + buildTime.toTimeString();
            }
            logs.push('CLIENT: ' + client + ' - ENV: ' + nodeEnv + ' - VERSION: ' + version + (process.env.APP_RELEASE ? ' - RELEASE DATE: ' + process.env.APP_RELEASE : '') + (buildTimeString ? ' - BUILD_TIME: ' + buildTimeString : '') + (firebase ? ' - FIREBASE: ' + firebase : ''));
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
        Http.setup(version, client, nodeEnv, 'application/json', callback);

        // 4 -  Moment
        moment.updateLocale('pt-br', require('moment/locale/pt-br'));

        // 5 - Version Check
        VersionCheck.setCurrentVersion(client, platform, version);
        VersionCheck.onMinVersionNotSatisfies(Http, callback.onMinVersionNotSatifies);
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
                console.clear = function () {
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
