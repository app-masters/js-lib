import FlexStorage from './dependencies/flexStorage';

var amStorage;

class AMStorage {
    constructor (storageBackend) {
        amStorage = new FlexStorage({
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

    save (params) {
        return amStorage.save(params);
    }

    load (params) {
        return amStorage.load(params);
    }

    getItem (key) {
        return new Promise((fulfill, reject) => {
            amStorage.load({key: key}).then(data => {
                fulfill(data);
            }).catch((error) => {
                if (error.name === 'NotFoundError') {
                    fulfill(null);
                } else {
                    reject(error);
                }
            });
        });
    }

    setItem (key, value) {
        // I don't know what's happening but works! (DON'T CHANGE) Beware, marreta bellow this line
        // Now I know
        return new Promise((fulfill, reject) => {
            // console.log(key,value);
            amStorage.save({key: key, data: value}).then(data => {
                // console.log("shit!",data);
                fulfill(value);
            });
        });
    }

    hasItem (key) {
        return new Promise((fulfill, reject) => {
            this.getItem(key).then(data => {
                let itemInStorage =
                    !(Array.isArray(data) && data.length < 1) && // Data is not a empty array
                    data !== null;
                fulfill(itemInStorage);
            });
        });
    }

    removeItem (key) {
        return new Promise((fulfill, reject) => {
            // console.log(key,value);
            amStorage.removeItem(key).then(data => {
                console.log('removeItem', data);
                fulfill(data);
            });
        });
    }

    clear () {
        return amStorage.clear();
    }
}

export default AMStorage;
