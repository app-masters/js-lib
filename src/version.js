import {min} from "moment";

let minActualClientVersion = null;
let actualVersionSatisfies = true;

export default class VersionCheck {
    static setCurrentVersion(client, platform, version) {
        VersionCheck.client = client;
        VersionCheck.platform = platform;
        VersionCheck.currentClientVersion = version;
    }

    /**
     * Tell if the current client version are ok with the min version setted on api
     * @param {object} req - Pure HTTP request
     * @param {string} client - "web" or "mobile"
     * @returns {boolean}
     * @author Tiago Gouvêa / Max William
     */
    static minVersionSatisfies(req) {
        let client = VersionCheck.client;
        let platform = VersionCheck.platform;
        if (client !== 'admin' && client !== 'web' && client !== 'mobile') {
            throw new Error('Invalid client calling on minVersionSatisfies');
        }

        // Check Client version
        let param = 'min-' + client + '-version';
        let minClientVersion = req.headers.get(param);
        let minClientVersionSatisfies = this.actualVersionSatisfies(minClientVersion, param, req);

        // Check platform (ios/android) version
        let minPlatformVersionSatisfies = true;
        if (platform !== 'web') {
            let param = 'min-' + platform + '-version';
            let minPlatformVersion = req.headers.get(param);
            if (minPlatformVersion)
                minPlatformVersionSatisfies = this.actualVersionSatisfies(minPlatformVersion, param, req);
        }

        return minPlatformVersionSatisfies && minClientVersionSatisfies;
    }

    static actualVersionSatisfies(minClientVersion, param, req) {
        if (!minClientVersion) {
            console.error(param + ' should not be null');
            console.log('showing all headers received:');
            const headers = req.headers.entries();
            for (var pair of req.headers.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            return true;
        }
        if (!minActualClientVersion || minActualClientVersion !== minClientVersion) {
            // console.log(param, minClientVersion);
            // console.log('Version now', VersionCheck.currentClientVersion);
            // The min version changed. Check it our version satisfies.
            let currentVersion = VersionCheck.currentClientVersion;

            let comp = VersionCheck.versionCompare(minClientVersion, currentVersion);
            minActualClientVersion = minClientVersion;
            // console.log('comp', comp);
            actualVersionSatisfies = (comp <= 0);
        }
        return actualVersionSatisfies;
    }

    /**
     * Listener to tell you when your version not fit the min version defined on API
     * @param Http
     * @param callback
     * @author Tiago Gouvêa / Max William
     */
    static onMinVersionNotSatisfies(Http, callback) {
        if (!VersionCheck.currentClientVersion) {
            throw new Error('VersionCheck.currentClientVersion null. You must call setCurrentVersion before all other VersionCheck calls');
        }

        Http.setRequestListener(req => {
            if (!VersionCheck.minVersionSatisfies(req)) {
                // Duplicated code
                let client = VersionCheck.client;
                let param = 'min-' + client + '-version';
                let minClientVersion = req.headers.get(param);
                console.log("version client", client);
                console.log("version param", param);
                console.log("version minClientVersion", minClientVersion);
                callback(minClientVersion);
            }
        });
    }

    /**
     * Listener to tell you when your client was updated
     * @param storage
     * @author Tiago Gouvêa
     */
    static onNewVersion(storage) {
        return new Promise((resolve, reject) => {
            if (!VersionCheck.currentClientVersion) {
                reject(new Error('VersionCheck.currentClientVersion null. You must call setCurrentVersion before all other VersionCheck calls'));
            }
            // console.log('callback', callback);
            storage.getItem('last-app-version').then(data => {
                // console.log('storaged version', data);
                if (data === null) {
                    storage.setItem('last-app-version', VersionCheck.currentClientVersion).then(data => {
                        // console.log('will proceed after setItem');
                        resolve(VersionCheck.currentClientVersion, false);
                    });
                } else {
                    // console.log(VersionCheck.currentClientVersion);
                    let comp = VersionCheck.versionCompare(VersionCheck.currentClientVersion, data);
                    // console.log('comp', comp, VersionCheck.currentClientVersion, data);
                    let fromBeta = VersionCheck.currentClientVersion[0] !== '0' && data[0] === '0';
                    // comp = 1; fromBeta = true;
                    if (comp > 0) {
                        storage.setItem('last-app-version', VersionCheck.currentClientVersion).then(data => {
                            // console.log('will proceed after setItem');
                            resolve(VersionCheck.currentClientVersion, fromBeta);
                        });
                    }
                }
            }).catch(storageError => {
                reject(storageError);
            });
        });
    }

    /**
     * Compare two versions string to tell if are diferent
     * @param v1
     * @param v2
     * @param options
     * @returns {int} 0 are equal, 1 when v1 is greater than v2, -1 if not
     */
    static versionCompare(v1, v2, options) {
        // console.log('compare v1', v1);
        // console.log('compare v2', v2);
        var lexicographical = options && options.lexicographical,
            zeroExtend = options && options.zeroExtend,
            v1parts = v1.split('.'),
            v2parts = v2.split('.');

        function isValidPart(x) {
            return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
        }

        if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
            return NaN;
        }

        if (zeroExtend) {
            while (v1parts.length < v2parts.length) v1parts.push('0');
            while (v2parts.length < v1parts.length) v2parts.push('0');
        }

        if (!lexicographical) {
            v1parts = v1parts.map(Number);
            v2parts = v2parts.map(Number);
        }

        for (var i = 0; i < v1parts.length; ++i) {
            if (v2parts.length == i) {
                return 1;
            }

            if (v1parts[i] == v2parts[i]) {
                continue;
            } else if (v1parts[i] > v2parts[i]) {
                return 1;
            } else {
                return -1;
            }
        }

        if (v1parts.length != v2parts.length) {
            return -1;
        }

        return 0;
    }
}
