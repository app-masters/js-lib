import * as moment from "moment";

import {Http, VersionCheck, Rollbar} from "./index";

// Move to some amLib
export default function appBootstrap(client, packag, envs, storage, callback) {

    // Validate parans
    if (!client || ["web", "mobile"].indexOf(client) < 0)
        throw ("Unrecognized or undefined client: " + client);
    // @todo Validate envs
    // @todo Validate packag
    // @todo Validate storage
    if (!callback || !callback.onMinVersionNotSatifies || !callback.onNewVersion)
        throw ("You must pass callback parameter to appBoostrap, with onMinVersionNotSatifies and onNewVersion methods.");

    // 1 - Decide env
    let nodeEnv = process.env.NODE_ENV;
    let version = packag.version;
    let firebase = process.env.FIREBASE && process.env.FIREBASE === true;
    // let release = packag.release;
    // console.log("packag", packag);
    console.log('CLIENT: ' + client + " - ENV: " + nodeEnv + " - VERSION: " + version + " - RELEASE DATE: " + process.env.APP_RELEASE + " - FIREBASE: " + firebase);
    // console.log(envs);
    let config = envs[nodeEnv];
    // console.log("config", config);
    if (config === undefined) {
        throw new Error("No config for NODE_ENV \"" + nodeEnv + "\"");
    }

    // 2 - Rollbar / bugsnag
    if (config.rollbar) {
        Rollbar.setup(config.rollbar.accessToken, client + "_" + nodeEnv, process.env.APP_VERSION);
    } else if (config.bugsnag) {
        bugsnagConfig(__DEV__);
    } else {
        throw new Error("You must have Rollbar or bugsnag on your app.");
    }

    // 3 - Http
    Http.setBaseURL(config.baseUrl);
    // if (process.env.NODE_ENV === "development") {
    //     Http.setBaseURL('https://willim-dev.herokuapp.com/api');
    // } else if (process.env.NODE_ENV === "development") {
    //     Http.setBaseURL('http://localhost:3000/api');
    // } else if (process.env.NODE_ENV === "staging") {
    //     Http.setBaseURL('https://willim-staging.herokuapp.com/api');
    // } else if (process.env.NODE_ENV === "production") {
    //     Http.setBaseURL('https://willim-prod.herokuapp.com/api');
    // } else {
    //     throw new Error("Unable to detect env. NODE_ENV: " + process.env.NODE_ENV);
    // }
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
            // Remove logs on PROD
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