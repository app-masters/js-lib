'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//  This file is used just to make "storage" work.

/*
 *  https://github.com/sunnylqm/react-native-storage/
 *  local storage(web/react native) wrapper
 *  sunnylqm 2017-04-20
 *  version 0.2.0
 */

var FlexStorage = function () {
    function FlexStorage() {
        var _this = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, FlexStorage);

        this._SIZE = options.size || 1000; // maximum capacity
        this.sync = options.sync || {}; // remote sync method
        this.defaultExpires = options.defaultExpires !== undefined ? options.defaultExpires : 1000 * 3600 * 24;
        this.enableCache = options.enableCache !== false;
        this._s = options.storageBackend || null;
        this._innerVersion = 11;
        this.cache = {};

        if (this._s && this._s.setItem) {
            try {
                var promiseTest = this._s.setItem('__react_native_storage_test', 'test');
                this.isPromise = !!(promiseTest && promiseTest.then);
            } catch (e) {
                console.warn(e);
                delete this._s;
                throw e;
            }
        } else {
            console.warn('Data would be lost after reload cause there is no storageBackend specified!\n      \nEither use localStorage(for web) or AsyncStorage(for React Native) as a storageBackend.');
        }

        this._mapPromise = this.getItem('map').then(function (map) {
            _this._m = _this._checkMap(map && JSON.parse(map) || {});
            // delete this._mapPromise;
        });
    }

    _createClass(FlexStorage, [{
        key: 'clear',
        value: function clear() {
            return this._s ? this.isPromise ? this._s.clear() : Promise.resolve(this._s.clear()) : Promise.resolve();
        }
    }, {
        key: 'getItem',
        value: function getItem(key) {
            return this._s ? this.isPromise ? this._s.getItem(key) : Promise.resolve(this._s.getItem(key)) : Promise.resolve();
        }
    }, {
        key: 'setItem',
        value: function setItem(key, value) {
            // console.log(Promise.resolve(this._s.setItem(key, value)));
            // let aa = this._s.setItem(key, value);
            // console.log (aa);
            return this._s ? this.isPromise ? this._s.setItem(key, value) : Promise.resolve(this._s.setItem(key, value)) : Promise.resolve();
        }
    }, {
        key: 'removeItem',
        value: function removeItem(key) {
            return this._s ? this.isPromise ? this._s.removeItem(key) : Promise.resolve(this._s.removeItem(key)) : Promise.resolve();
        }
    }, {
        key: '_initMap',
        value: function _initMap() {
            return {
                innerVersion: this._innerVersion,
                index: 0,
                __keys__: {}
            };
        }
    }, {
        key: '_checkMap',
        value: function _checkMap(map) {
            if (map && map.innerVersion && map.innerVersion === this._innerVersion) {
                return map;
            } else {
                return this._initMap();
            }
        }
    }, {
        key: '_getId',
        value: function _getId(key, id) {
            return key + '_' + id;
        }
    }, {
        key: '_saveToMap',
        value: function _saveToMap(params) {
            var key = params.key,
                id = params.id,
                data = params.data,
                newId = this._getId(key, id),
                m = this._m;

            if (m[newId] !== undefined) {
                // update existed data
                if (this.enableCache) this.cache[newId] = JSON.parse(data);
                return this.setItem('map_' + m[newId], data);
            }
            if (m[m.index] !== undefined) {
                // loop over, delete old data
                var oldId = m[m.index];
                var splitOldId = oldId.split('_');
                delete m[oldId];
                this._removeIdInKey(splitOldId[0], splitOldId[1]);
                if (this.enableCache) {
                    delete this.cache[oldId];
                }
            }
            m[newId] = m.index;
            m[m.index] = newId;

            m.__keys__[key] = m.__keys__[key] || [];
            m.__keys__[key].push(id);

            if (this.enableCache) {
                var cacheData = JSON.parse(data);
                this.cache[newId] = cacheData;
            }
            var currentIndex = m.index;
            if (++m.index === this._SIZE) {
                m.index = 0;
            }
            this.setItem('map_' + currentIndex, data);
            this.setItem('map', JSON.stringify(m));
        }
    }, {
        key: 'save',
        value: function save(params) {
            var _this2 = this;

            var key = params.key,
                id = params.id,
                data = params.data,
                rawData = params.rawData,
                _params$expires = params.expires,
                expires = _params$expires === undefined ? this.defaultExpires : _params$expires;

            if (key.toString().indexOf('_') !== -1) {
                console.log('Please do not use "_" in key!');
            }
            var dataToSave = { rawData: data };
            if (data === undefined) {
                if (rawData !== undefined) {
                    console.warn('"rawData" is deprecated, please use "data" instead!');
                    dataToSave.rawData = rawData;
                } else {
                    console.log('"data" is required in save()!');
                    return;
                }
            }
            var now = new Date().getTime();
            if (expires !== null) {
                dataToSave.expires = now + expires;
            }
            dataToSave = JSON.stringify(dataToSave);
            // console.log(dataToSave);
            if (id === undefined) {
                if (this.enableCache) {
                    var cacheData = JSON.parse(dataToSave);
                    this.cache[key] = cacheData;
                }
                // console.log(dataToSave);
                return this.setItem(key, dataToSave);
            } else {
                if (id.toString().indexOf('_') !== -1) {
                    console.error('Please do not use "_" in id!');
                }
                return this._mapPromise.then(function () {
                    return _this2._saveToMap({
                        key: key,
                        id: id,
                        data: dataToSave
                    });
                });
            }
        }
    }, {
        key: 'getBatchData',
        value: function getBatchData(querys) {
            var tasks = [];
            for (var i = 0, query; query = querys[i]; i++) {
                tasks[i] = this.load(query);
            }
            return Promise.all(tasks);
        }
    }, {
        key: 'getBatchDataWithIds',
        value: function getBatchDataWithIds(params) {
            var _this3 = this;

            var key = params.key,
                ids = params.ids,
                syncInBackground = params.syncInBackground;


            return Promise.all(ids.map(function (id) {
                return _this3.load({ key: key, id: id, syncInBackground: syncInBackground, autoSync: false, batched: true });
            })).then(function (results) {
                return new Promise(function (resolve, reject) {
                    var ids = results.filter(function (value) {
                        return value.syncId !== undefined;
                    });
                    if (!ids.length) {
                        return resolve();
                    }
                    return _this3.sync[key]({
                        id: ids.map(function (value) {
                            return value.syncId;
                        }),
                        resolve: resolve,
                        reject: reject
                    });
                }).then(function (data) {
                    return results.map(function (value) {
                        return value.syncId ? data.shift() : value;
                    });
                });
            });
        }
    }, {
        key: '_lookupGlobalItem',
        value: function _lookupGlobalItem(params) {
            var _this4 = this;

            var ret = void 0;
            var key = params.key;

            if (this.enableCache && this.cache[key] !== undefined) {
                ret = this.cache[key];
                return this._loadGlobalItem(_extends({ ret: ret }, params));
            }
            return this.getItem(key).then(function (ret) {
                return _this4._loadGlobalItem(_extends({ ret: ret }, params));
            });
        }
    }, {
        key: '_loadGlobalItem',
        value: function _loadGlobalItem(params) {
            var _this5 = this;

            var key = params.key,
                ret = params.ret,
                autoSync = params.autoSync,
                syncInBackground = params.syncInBackground,
                syncParams = params.syncParams;

            if (ret === null || ret === undefined) {
                if (autoSync && this.sync[key]) {
                    return new Promise(function (resolve, reject) {
                        return _this5.sync[key]({ resolve: resolve, reject: reject, syncParams: syncParams });
                    });
                }
                return Promise.reject(new NotFoundError(JSON.stringify(params)));
            }
            if (typeof ret === 'string') {
                ret = JSON.parse(ret);
                if (this.enableCache) {
                    this.cache[key] = ret;
                }
            }
            var now = new Date().getTime();
            if (ret.expires < now) {
                if (autoSync && this.sync[key]) {
                    if (syncInBackground) {
                        this.sync[key]({ syncParams: syncParams });
                        return Promise.resolve(ret.rawData);
                    }
                    return new Promise(function (resolve, reject) {
                        return _this5.sync[key]({ resolve: resolve, reject: reject, syncParams: syncParams });
                    });
                }
                return Promise.reject(new ExpiredError(JSON.stringify(params)));
            }
            return Promise.resolve(ret.rawData);
        }
    }, {
        key: '_noItemFound',
        value: function _noItemFound(params) {
            var _this6 = this;

            var key = params.key,
                id = params.id,
                autoSync = params.autoSync,
                syncParams = params.syncParams;

            if (this.sync[key]) {
                if (autoSync) {
                    return new Promise(function (resolve, reject) {
                        return _this6.sync[key]({ id: id, syncParams: syncParams, resolve: resolve, reject: reject });
                    });
                }
                return Promise.resolve({ syncId: id });
            }
            return Promise.reject(new NotFoundError(JSON.stringify(params)));
        }
    }, {
        key: '_loadMapItem',
        value: function _loadMapItem(params) {
            var _this7 = this;

            var ret = params.ret,
                key = params.key,
                id = params.id,
                autoSync = params.autoSync,
                batched = params.batched,
                syncInBackground = params.syncInBackground,
                syncParams = params.syncParams;

            if (ret === null || ret === undefined) {
                return this._noItemFound(params);
            }
            if (typeof ret === 'string') {
                ret = JSON.parse(ret);
                var _key = params.key,
                    _id = params.id;

                var newId = this._getId(_key, _id);
                if (this.enableCache) {
                    this.cache[newId] = ret;
                }
            }
            var now = new Date().getTime();
            if (ret.expires < now) {
                if (autoSync && this.sync[key]) {
                    if (syncInBackground) {
                        this.sync[key]({ id: id, syncParams: syncParams });
                        return Promise.resolve(ret.rawData);
                    }
                    return new Promise(function (resolve, reject) {
                        return _this7.sync[key]({ id: id, resolve: resolve, reject: reject, syncParams: syncParams });
                    });
                }
                if (batched) {
                    return Promise.resolve({ syncId: id });
                }
                return Promise.reject(new ExpiredError(JSON.stringify(params)));
            }
            return Promise.resolve(ret.rawData);
        }
    }, {
        key: '_lookUpInMap',
        value: function _lookUpInMap(params) {
            var _this8 = this;

            var m = this._m,
                ret = void 0;
            var key = params.key,
                id = params.id;

            var newId = this._getId(key, id);
            if (this.enableCache && this.cache[newId]) {
                ret = this.cache[newId];
                return this._loadMapItem(_extends({ ret: ret }, params));
            }
            if (m[newId] !== undefined) {
                return this.getItem('map_' + m[newId]).then(function (ret) {
                    return _this8._loadMapItem(_extends({ ret: ret }, params));
                });
            }
            return this._noItemFound(_extends({ ret: ret }, params));
        }
    }, {
        key: 'remove',
        value: function remove(params) {
            var _this9 = this;

            return this._mapPromise.then(function () {
                var m = _this9._m;
                var key = params.key,
                    id = params.id;


                if (id === undefined) {
                    if (_this9.enableCache && _this9.cache[key]) {
                        delete _this9.cache[key];
                    }
                    return _this9.removeItem(key);
                }
                var newId = _this9._getId(key, id);

                // remove existed data
                if (m[newId] !== undefined) {
                    if (_this9.enableCache && _this9.cache[newId]) {
                        delete _this9.cache[newId];
                    }
                    _this9._removeIdInKey(key, id);
                    var idTobeDeleted = m[newId];
                    delete m[newId];
                    _this9.setItem('map', JSON.stringify(m));
                    return _this9.removeItem('map_' + idTobeDeleted);
                }
            });
        }
    }, {
        key: '_removeIdInKey',
        value: function _removeIdInKey(key, id) {
            var indexTobeRemoved = (this._m.__keys__[key] || []).indexOf(id);
            if (indexTobeRemoved !== -1) {
                this._m.__keys__[key].splice(indexTobeRemoved, 1);
            }
        }
    }, {
        key: 'load',
        value: function load(params) {
            var _this10 = this;

            var key = params.key,
                id = params.id,
                _params$autoSync = params.autoSync,
                autoSync = _params$autoSync === undefined ? true : _params$autoSync,
                _params$syncInBackgro = params.syncInBackground,
                syncInBackground = _params$syncInBackgro === undefined ? true : _params$syncInBackgro,
                syncParams = params.syncParams;

            return this._mapPromise.then(function () {
                return new Promise(function (resolve, reject) {
                    if (id === undefined) {
                        return resolve(_this10._lookupGlobalItem({
                            key: key, resolve: resolve, reject: reject, autoSync: autoSync, syncInBackground: syncInBackground, syncParams: syncParams
                        }));
                    }
                    return resolve(_this10._lookUpInMap({
                        key: key, id: id, resolve: resolve, reject: reject, autoSync: autoSync, syncInBackground: syncInBackground, syncParams: syncParams
                    }));
                });
            });
        }
    }, {
        key: 'clearMap',
        value: function clearMap() {
            var _this11 = this;

            console.log('clearing...');
            this.removeItem('map').then(function () {
                _this11._m = _this11._initMap();
            });
        }
    }, {
        key: 'clearMapForKey',
        value: function clearMapForKey(key) {
            var _this12 = this;

            return this._mapPromise.then(function () {
                var tasks = (_this12._m.__keys__[key] || []).map(function (id) {
                    return _this12.remove({ key: key, id: id });
                });
                return Promise.all(tasks);
            });
        }
    }, {
        key: 'getIdsForKey',
        value: function getIdsForKey(key) {
            var _this13 = this;

            return this._mapPromise.then(function () {
                return _this13._m.__keys__[key] || [];
            });
        }
    }, {
        key: 'getAllDataForKey',
        value: function getAllDataForKey(key, options) {
            var _this14 = this;

            options = Object.assign({ syncInBackground: true }, options);
            return this.getIdsForKey(key).then(function (ids) {
                var querys = ids.map(function (id) {
                    return { key: key, id: id, syncInBackground: options.syncInBackground };
                });
                return _this14.getBatchData(querys);
            });
        }
    }]);

    return FlexStorage;
}();

exports.default = FlexStorage;

var NotFoundError = function NotFoundError(message) {
    _classCallCheck(this, NotFoundError);

    this.name = 'NotFoundError';
    this.message = 'Not Found! Params: ' + message;
    this.stack = new Error().stack; // Optional
};
// NotFoundError.prototype = Object.create(Error.prototype);

var ExpiredError = function ExpiredError(message) {
    _classCallCheck(this, ExpiredError);

    this.name = 'ExpiredError';
    this.message = 'Expired! Params: ' + message;
    this.stack = new Error().stack; // Optional
};