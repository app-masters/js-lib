'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var minActualClientVersion = null;
var actualVersionSatisfies = true;

var VersionCheck = function () {
    function VersionCheck() {
        _classCallCheck(this, VersionCheck);
    }

    _createClass(VersionCheck, null, [{
        key: 'setCurrentVersion',
        value: function setCurrentVersion(client, version) {
            VersionCheck.client = client;
            VersionCheck.currentClientVersion = version;
        }

        /**
         * Tell if the current client version are ok with the min version setted on api
         * @param {object} req - Pure HTTP request
         * @param {string} client - "web" or "mobile"
         * @returns {boolean}
         * @author Tiago Gouvêa / Max William
         */

    }, {
        key: 'minVersionSatisfies',
        value: function minVersionSatisfies(req) {
            var client = VersionCheck.client;
            if (client !== 'admin' && client !== 'web' && client !== 'mobile') {
                throw new Error('Invalid client calling on minVersionSatisfies');
            }
            var param = 'min-' + client + '-version';
            var minClientVersion = req.headers.get(param);

            if (!minClientVersion) {
                console.error(param + ' cannot be null');
                console.log('showing all headers received:');
                var headers = req.headers.entries();
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = req.headers.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var pair = _step.value;

                        console.log(pair[0] + ': ' + pair[1]);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return true;
            }
            if (!minActualClientVersion || minActualClientVersion !== minClientVersion) {
                console.log(param, minClientVersion);
                console.log('Version now', VersionCheck.currentClientVersion);
                // The min version changed. Check it our version satisfies.
                var currentVersion = VersionCheck.currentClientVersion;

                var comp = VersionCheck.versionCompare(minClientVersion, currentVersion);
                minActualClientVersion = minClientVersion;
                // console.log('comp', comp);
                actualVersionSatisfies = comp <= 0;
            }
            return actualVersionSatisfies;
        }

        /**
         * Listener to tell you when your version not fit the min version defined on API
         * @param Http
         * @param callback
         * @author Tiago Gouvêa / Max William
         */

    }, {
        key: 'onMinVersionNotSatifies',
        value: function onMinVersionNotSatifies(Http, callback) {
            if (!VersionCheck.currentClientVersion) {
                throw new Error('VersionCheck.currentClientVersion null. You must call setCurrentVersion before all other VersionCheck calls');
            }

            Http.setRequestListener(function (req) {
                if (!VersionCheck.minVersionSatisfies(req)) {
                    var betaFinished = VersionCheck.currentClientVersion[0] === '0' && minActualClientVersion[0] !== '0';
                    var isOnBeta = VersionCheck.currentClientVersion[0] === '0';
                    callback(betaFinished, isOnBeta);
                }
            });
        }

        /**
         * Listener to tell you when your client was updated
         * @param storage
         * @author Tiago Gouvêa
         */

    }, {
        key: 'onNewVersion',
        value: function onNewVersion(storage) {
            return new Promise(function (resolve, reject) {
                if (!VersionCheck.currentClientVersion) {
                    reject(new Error('VersionCheck.currentClientVersion null. You must call setCurrentVersion before all other VersionCheck calls'));
                }
                // console.log('callback', callback);
                storage.getItem('last-app-version').then(function (data) {
                    // console.log('storaged version', data);
                    if (data === null) {
                        storage.setItem('last-app-version', VersionCheck.currentClientVersion).then(function (data) {
                            // console.log('will proceed after setItem');
                            resolve(VersionCheck.currentClientVersion, false);
                        });
                    } else {
                        // console.log(VersionCheck.currentClientVersion);
                        var comp = VersionCheck.versionCompare(VersionCheck.currentClientVersion, data);
                        // console.log('comp', comp, VersionCheck.currentClientVersion, data);
                        var fromBeta = VersionCheck.currentClientVersion[0] !== '0' && data[0] === '0';
                        // comp = 1; fromBeta = true;
                        if (comp > 0) {
                            storage.setItem('last-app-version', VersionCheck.currentClientVersion).then(function (data) {
                                // console.log('will proceed after setItem');
                                resolve(VersionCheck.currentClientVersion, fromBeta);
                            });
                        }
                    }
                }).catch(function (storageError) {
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

    }, {
        key: 'versionCompare',
        value: function versionCompare(v1, v2, options) {
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
                while (v1parts.length < v2parts.length) {
                    v1parts.push('0');
                }while (v2parts.length < v1parts.length) {
                    v2parts.push('0');
                }
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
    }]);

    return VersionCheck;
}();

exports.default = VersionCheck;