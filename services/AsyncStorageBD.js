import AsyncStorage from '@react-native-community/async-storage';

export default class AsyncStorageBD {
    constructor(dbName) {
        this.dbName_ = dbName;
        this.storeKey = (storeName, key) => this.dbName_ + '_' + storeName + '_' + key;
        console.log("Create db: ", dbName)
    }
    get(storeName, key) {
        return AsyncStorage.getItem(this.storeKey(storeName, key)).then(value => JSON.parse(value));
    }

    getAll(storeName, desc) {
        return this.keys(storeName)
            .then(keys => keys.length === 0 ? [] : AsyncStorage.multiGet(desc ? keys.reverse() : keys))
            .then(results => results.map(result => ({
                key: result[0],
                value: JSON.parse(result[1])
            })));
    }

    set(storeName, key, value) {
        if ((value === void 0) || (value === null)) {
            return this.remove(storeName, key);
        }
        return AsyncStorage.setItem(this.storeKey(storeName, key), JSON.stringify(value));
    }

    remove(storeName, key) {
        return AsyncStorage.removeItem(this.storeKey(storeName, key));
    }
    removeItemByKey(key) {
        return AsyncStorage.removeItem(key)
    }
    removeStore(storeName) {
        this.keys(storeName)
            .then(keys => keys.length === 0 ? [] : AsyncStorage.multiRemove(keys));
    }

    clearDB() {
        this.removeStore();
    }
    keys(storeName) {
        return AsyncStorage.getAllKeys()
            .then(keys => {
                return keys.filter(key => key.indexOf(this.dbName_ + "_" + storeName) === 0).sort()
            });
    }

    count(storeName) {
        return this.keys(storeName).then(keys => keys.length);
    }

};
