import * as moment from "moment";

import {Http, VersionCheck, Rollbar} from "./index";

class AppBootstrap {

    static setup(client, packag, envs, storage, callback) {

        // Validate parans
        if (!client || ["web", "mobile", "admin"].indexOf(client) < 0)
            throw ("Unrecognized or undefined client: " + client);
        // @todo Validate envs
        // @todo Validate packag
        // @todo Validate storage
        if (!callback || !callback.onMinVersionNotSatifies || !callback.onNewVersion || !callback.onUncaughtError)
            throw ("You must pass callback parameter to AppBootstrap.setup, with onMinVersionNotSatifies, onNewVersion and onUncaughtError methods.");
        AppBootstrap.callbacks = callback;

        // 1 - Decide env
        let nodeEnv = process.env.NODE_ENV;
        let version = packag.version;
        let firebase;
        let buildTime;
        let buildTimeString;
        if (client !== "mobile") {
            firebase = process.env.FIREBASE && process.env.FIREBASE === true;
            buildTime = new Date(process.env.BUILD_TIME);
            buildTimeString = buildTime.toDateString() + " " + buildTime.toTimeString();
            console.log('CLIENT:' + client + " - ENV:" + nodeEnv + " - VERSION:" + version + " - RELEASE DATE:" + process.env.APP_RELEASE + " - BUILD_TIME:" + buildTimeString + " - FIREBASE:" + firebase);
        } else if (__DEV__ !== undefined) {
            console.log('MOBILE CLIENT:' + client + " - ENV:" + nodeEnv + " - VERSION:" + version);
        }

        // console.log(envs);
        let config;
        if (nodeEnv === "development" && firebase) {
            config = envs["development_firebase"];
            console.log("> firebase development <");
        } else {
            config = envs[nodeEnv];
        }

        console.log("Loaded config", config);
        if (config === undefined) {
            throw new Error("No config for NODE_ENV \"" + nodeEnv + "\"");
        }
        AppBootstrap.config = config;

        // 2 - Rollbar / bugsnag
        if (config.rollbarToken) {
            Rollbar.setup(config.rollbarToken, client + "_" + nodeEnv, process.env.APP_VERSION);
        } else if (config.bugsnag) {
            bugsnagConfig(__DEV__);
        } else if (nodeEnv === "development") {
            console.warn("Rollbar not set on dev. It's ok.");
        } else {
            throw new Error("You must have Rollbar or bugsnag on your app.");
        }

        // 3 - Http
        Http.setBaseURL(config.baseUrl);
        Http.setHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'client': client,
            'client-env': nodeEnv
        });

        // 4 -  Moment
        moment.updateLocale('pt-br', require('moment/locale/pt-br'));

        // 5 - Version Check
        VersionCheck.setCurrentVersion(client, version);
        VersionCheck.onMinVersionNotSatifies(Http, callback.onMinVersionNotSatifies);
        VersionCheck.onNewVersion(storage, callback.onNewVersion);

        // // 6 - Capture errors onUncaught in AmActions
        // AMActions.onUncaughtError((e) => {
        //     if (e.message === 'Network request failed') {
        //         console.log('Network request failed, maybe you are offline');
        //     } else {
        //         console.error(e);
        //     }
        // });

        // 7 - Mobile fixes
        if (client === "mobile") {
            if (nodeEnv === "production") {
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