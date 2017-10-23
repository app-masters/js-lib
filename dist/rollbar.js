'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rollbar = require('./dependencies/rollbar');

var _rollbar2 = _interopRequireDefault(_rollbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rollbar;

var Rollbar = function () {
    function Rollbar() {
        _classCallCheck(this, Rollbar);
    }

    _createClass(Rollbar, null, [{
        key: 'setup',
        value: function setup(accessToken, env, version, logOnDev) {
            Rollbar.logOnDev = logOnDev === true;
            Rollbar.env = process.env.NODE_ENV;
            if (Rollbar.env === 'production' || Rollbar.logOnDev) {
                (0, _rollbar2.default)(accessToken, env, version, logOnDev === true, function (instance) {
                    // console.log("rollbar setup done");
                    rollbar = instance;
                    Rollbar.sendPersonIfNeeded();
                });
            }
        }
    }, {
        key: 'log',
        value: function log(message, payload, err, callback) {
            Rollbar.sendPersonIfNeeded();
            if (this.mustSend()) rollbar.info(message, payload, err, callback);else {
                console.warn('Rollbar.log > Log whould be sent to rollbar');
                console.error(err, message, payload);
            }
        }
    }, {
        key: 'info',
        value: function info(message, payload, err, callback) {
            Rollbar.sendPersonIfNeeded();
            if (this.mustSend()) rollbar.info(message, payload, err, callback);
        }
    }, {
        key: 'debug',
        value: function debug(message, payload, err, callback) {
            Rollbar.sendPersonIfNeeded();
            if (this.mustSend()) rollbar.info(message, payload, err, callback);
        }
    }, {
        key: 'warning',
        value: function warning(err, message, payload, callback) {
            Rollbar.sendPersonIfNeeded();
            if (this.mustSend()) rollbar.info(message, payload, err, callback);else {
                console.warn('Rollbar.warning > Warning whould be sent to rollbar');
                console.error(err, message, payload);
            }
        }
    }, {
        key: 'error',
        value: function error(err, message, payload, callback) {
            Rollbar.sendPersonIfNeeded();
            if (this.mustSend()) rollbar.error(err, message, payload, callback);else {
                console.warn('Rollbar.error > Error whould be sent to rollbar');
                console.error(err);
            }
        }
    }, {
        key: 'critical',
        value: function critical(err, message, payload, callback) {
            Rollbar.sendPersonIfNeeded();
            if (this.mustSend()) rollbar.error(err, message, payload, callback);
        }
    }, {
        key: 'setPerson',
        value: function setPerson(id, email, name) {
            Rollbar.personId = id;
            Rollbar.personEmail = email;
            Rollbar.personName = name;
            Rollbar.sendPersonIfNeeded();
        }
    }, {
        key: 'sendPerson',
        value: function sendPerson() {
            if (!rollbar) return; //console.error("rollbar not defined at sendPerson?")

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
    }, {
        key: 'sendPersonIfNeeded',
        value: function sendPersonIfNeeded() {
            if (Rollbar.personId && !Rollbar.personSent) Rollbar.sendPerson();
        }

        /**
         * Tell if something must be sent to Rollbar
         * @returns {*|boolean}
         */

    }, {
        key: 'mustSend',
        value: function mustSend() {
            return rollbar && (Rollbar.env !== 'development' || Rollbar.logOnDev);
        }
    }]);

    return Rollbar;
}();

exports.default = Rollbar;