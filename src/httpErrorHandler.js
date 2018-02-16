import Rollbar from './rollbar';

class HttpErrorHandler {
    static setup (callback) {
        // More callbacks can be added if necessary in the future
        if (!callback || !callback.onConnectionFail || !callback.onAPIFail)
            throw ('You must pass callback parameter to AppBootstrap.setup, with onConnectionFail and onAPIFail methods.');
        HttpErrorHandler.callback['onAPIFail'] = callback.onAPIFail;
        HttpErrorHandler.callback['onConnectionFail'] = callback.onConnectionFail;
        HttpErrorHandler.callback['errorCatcher'] = callback.errorCatcher; // Optional
    }

    static handle (error) {
        console.log('handle', error);
        error.name = error.name || error;
        error.stack = new Error().stack;
        error.level = 'error';

        const handler = errorLibrary[error.name];
        if (handler) {
            if (handler.message) {
                error.message = handler.message;
            }
            if (handler.callback && HttpErrorHandler.callback[handler.callback]) {
                HttpErrorHandler.callback[handler.callback](error);
            }
            if (handler.level === null) {
                return error;
            } else {
                error.level = handler.level;
            }
        }

        // Send to rollbar or defined errorCatcher
        if (this.callback.errorCatcher) {
            this.callback.errorCatcher(error);
        } else {
            Rollbar[error.level](error);
        }
        return error;
    };

    static mount (response) {
        let error = {};
        error.name = response.status;
        error.message = response.text() || 'Error with no message';
        throw error;
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
        message: 'Falha de comunicação com o servidor. Tente novamente.',
        callback: 'onConnectionFail'
    },
    '503': {
        level: 'warning',
        message: 'Falha de comunicação com o servidor. Tente novamente.',
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
    'TypeError: Failed to fetch': {
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