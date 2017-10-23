'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _flexStorage = require('./dependencies/flexStorage');

var _flexStorage2 = _interopRequireDefault(_flexStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

console.log('fui carregado, so mo noob');

var AMStorage = function () {
    function AMStorage(storageBackend) {
        _classCallCheck(this, AMStorage);

        this.amStorage = new _flexStorage2.default({
            // maximum capacity, default 1000
            size: 10000,

            // Use AsyncStorage for RN, or window.localStorage for web.
            // If not set, data would be lost after reload.
            storageBackend: storageBackend,

            // expire time, default 1 day(1000 * 3600 * 24 milliseconds).
            // can be null, which means never expire.
            defaultExpires: null,
            // cache data in the memory. default is true.
            enableCache: true

            // if data was not found in storage or expired,
            // the corresponding sync method will be invoked and return
            // the latest data.
            // sync: {
            // we'll talk about the details later.
            // }
        });
    }

    _createClass(AMStorage, [{
        key: 'save',
        value: function save(params) {
            return this.amStorage.save(params);
        }
    }, {
        key: 'load',
        value: function load(params) {
            return this.amStorage.load(params);
        }
    }, {
        key: 'getItem',
        value: function getItem(key) {
            var _this = this;

            return new Promise(function (fulfill, reject) {
                _this.amStorage.load({ key: key }).then(function (data) {
                    fulfill(data);
                }).catch(function (error) {
                    if (error.name === 'NotFoundError') {
                        fulfill(null);
                    } else {
                        reject(error);
                    }
                });
            });
        }
    }, {
        key: 'setItem',
        value: function setItem(key, value) {
            var _this2 = this;

            // I don't know what's happening but works! (DON'T CHANGE) Beware, marreta bellow this line
            // Now I know
            return new Promise(function (fulfill, reject) {
                // console.log(key,value);
                _this2.amStorage.save({ key: key, data: value }).then(function (data) {
                    // console.log("shit!",data);
                    fulfill(value);
                });
            });
        }
    }, {
        key: 'hasItem',
        value: function hasItem(key) {
            var _this3 = this;

            return new Promise(function (fulfill, reject) {
                _this3.getItem(key).then(function (data) {
                    var itemInStorage = !(Array.isArray(data) && data.length < 1) && // Data is not a empty array
                    data !== null;
                    fulfill(itemInStorage);
                });
            });
        }
    }, {
        key: 'removeItem',
        value: function removeItem(key) {
            var _this4 = this;

            return new Promise(function (fulfill, reject) {
                // console.log(key,value);
                _this4.amStorage.removeItem(key).then(function (data) {
                    console.log('removeItem', data);
                    fulfill(data);
                });
            });
        }
    }, {
        key: 'clear',
        value: function clear() {
            return this.amStorage.clear();
        }
    }]);

    return AMStorage;
}();

exports.default = AMStorage;