import Rollbar from './rollbar';

class HttpErrorHandler {
    static setup (callback) {
        // More callbacks can be added if necessary in the future
        if (!callback || !callback.onConnectionFail || !callback.onAPIFail) {
            console.warn('You must pass callback parameter to AppBootstrap.setup, with onConnectionFail and onAPIFail methods.');
        } else {
            HttpErrorHandler.callback['onAPIFail'] = callback.onAPIFail;
            HttpErrorHandler.callback['onConnectionFail'] = callback.onConnectionFail;
            HttpErrorHandler.callback['errorCatcher'] = callback.errorCatcher; // Optional
        }
    }

    static handle (error, method, url, body) {
        const errorObj = {payload: error}; // Keep the original error on payload

        // TypeError can have different meanings, so check the message
        if (error.name !== 'TypeError') {
            errorObj.name = error.name;
            errorObj.message = error.message;
        } else {
            errorObj.name = error.message;
            errorObj.message = error.message;
        }
        errorObj.stack = new Error().stack;
        errorObj.level = 'error'; // Default level

        errorObj.method = method;
        errorObj.url = url;
        errorObj.body = body;

        const handler = errorLibrary[errorObj.name];
        if (handler) {
            if (handler.message) {
                errorObj.message = handler.message;
            }
            if (handler.callback && HttpErrorHandler.callback[handler.callback]) {
                HttpErrorHandler.callback[handler.callback](errorObj);
                errorObj.sentToAnotherErrorHandler = true;
            }
            if (handler.level === null) {
                return errorObj;
            } else {
                errorObj.level = handler.level;
            }
        }

        // Send to rollbar or defined errorCatcher
        if (this.callback.errorCatcher) {
            this.callback.errorCatcher(errorObj);
        } else {
            Rollbar[errorObj.level](errorObj);
        }
        return errorObj;
    };

    static mount (response) {
        let error = {};
        error.headers = response.headers;
        error.name = response.status;
        return response.text().then((message) => {
            error.message = message || 'Error with no message';
            throw error;
        });
    }
}

// Http errors that need a special handle.
const errorLibrary = {
    '400': {
        level: null //Don't send to rollbar
    },
    '404': {
        level: 'error', // Send to rollbar as error
        message: 'Não encontrado.', // Change de message to the view
        callback: 'onAPIFail' // Call onAPIFail callback
    },
    '500': {
        level: 'warning',
        message: 'Falha do servidor. Tente novamente.',
        callback: 'onConnectionFail'
    },
    '503': {
        level: 'warning',
        message: 'Falha do servidor. Tente novamente.',
        callback: 'onConnectionFail'
    },
    'ValidatorError': {
        level: 'critical',
        message: 'Um campo foi preenchido com valor não permitido.',
        callback: 'onAPIFail'
    },
    'MongoError': {
        level: 'warning',
        message: 'Falha de comunicação com o servidor.',
        callback: 'onConnectionFail'
    },
    'Failed to fetch': {
        level: 'warning',
        message: 'Falha de comunicação com o servidor.',
        callback: 'onConnectionFail'
    },
    'FetchError': {
        level: 'warning',
        message: 'Falha de comunicação com o servidor.',
        callback: 'onConnectionFail'
    }
};

HttpErrorHandler.callback = {};

export default HttpErrorHandler;
