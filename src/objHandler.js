import Text from './text';

class ObjHandler {

    // get child or child of child or child of child of child...
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

    // Remove objects with a duplicate key from array of objects
    // (will keep the last found)
    static removeDuplicates = (objArray, key) => {
        let newArray = [];
        for (let index in objArray) {
            let foundIndex = null;
            const found = newArray.find((relation, i) => {
                if (ObjHandler.getChild(relation,key) === ObjHandler.getChild(objArray[index],key)) {
                    foundIndex = i;
                    return true;
                }
                return false;
            });
            if (found === undefined) {
                newArray.push(objArray[index]);
            } else {
                newArray[foundIndex] = found;
            }
        }
        return newArray;
    };

}

export default ObjHandler;
