import Text from './text';

class ObjHandler {

    // get child or child of child...
    // Key can be "key.otherKey"
    static getChild(obj, key) {
        let arr = key.split(".");
        while(arr.length && (obj = obj[arr.shift()]));
        return obj;
    }

    static sortByKey (objArray, key) {
        return objArray.sort((item, lastItem) => {
            const name = Text.replaceSpecial(item[key].toUpperCase());
            const last = Text.replaceSpecial(lastItem[key].toUpperCase());
            if (name < last) {
                return -1;
            } else if (name > last) {
                return 1;
            } else {
                return 0;
            }
        });
    };
}
