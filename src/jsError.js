
class ExtendableError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.stack = (new Error()).stack;
        this.name = this.constructor.name;
    }
}

export default class JSError extends ExtendableError {
    constructor(m) {
        super(m);
    }
}
