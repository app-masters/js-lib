import Rollbar from './rollbar';

class LaravelErrorHandler {
    static setup (callback) {
        console.log("HttpErrorHandler - setup");
        // More callbacks can be added if necessary in the future
        if (!callback || !callback.onConnectionFail || !callback.onAPIFail) {
            console.warn('You must pass callback parameter to AppBootstrap.setup, with onConnectionFail and onAPIFail methods.');
        } else {
            LaravelErrorHandler.callback['onAPIFail'] = callback.onAPIFail;
            LaravelErrorHandler.callback['onConnectionFail'] = callback.onConnectionFail;
            LaravelErrorHandler.callback['errorCatcher'] = callback.errorCatcher; // Optional
        }
    }

    /**
     * Before send error to the view, change it and send it to Rollbar
     * @param error
     * @param method
     * @param url
     * @param sentBody
     * @returns {*}
     */
    static handle (error, method, url, sentBody) {
        // Decorate error object
        if (error.status === 405 || error.status >= 500){
            // Server error, don't show original - 405 or 5XX
            error.body = {error: ['Falha no servidor']};
            error.level = 'critical';
        } else if (error.status >= 400 && error.status <= 430) {
            // User payload error - 4XX (except 405)
            const body = JSON.parse(error.remote);
            if (body.error) {
                body.error = body.error.map(error => error.replace(/ *\[[^)]*\] */g, ''));
            }
            error.body = body;
            error.level = 'user'; // User error, don't send to Rollbar
        } else {
            // Another error (can be a error without status code)
            error.body = {error: [error.remote || error.message]};
            error.level = 'error';
        }
        // Http info
        error.method = method;
        error.url = url;
        error.sentBody = sentBody;

        if (error.message) {
            error.originalMessage = error.message;
        }

        // error.level !== 'user'
        // Handle error
        console.log("LaravelErrorHandler.handle", error.name, error.status);
        if (!error.name){
            console.error("No error.name on LaravelErrorHandler.handle - error object:", error);
        }
        const handler = errorLibrary[error.name]; // error.name will work with laravel?
        if (handler) {
            if (handler.message) {
                error.message = handler.message;
            }
            if (handler.callback && LaravelErrorHandler.callback[handler.callback]) {
                LaravelErrorHandler.callback[handler.callback](error);
                error.sentToAnotherErrorHandler = true;
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
        error.sentToAnotherErrorHandler = true;
        return error;
    };


    /**
     * Generate error object from the API response
     * @param response
     * @returns {Promise<T | never>}
     */
    static mount (response) {
        let error = {};
        error.status = response.status;
        error.response = response; // Save original response
        error.level = null;
        return response.text().then((data) => {
            error.remote = data;
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

LaravelErrorHandler.callback = {};

export default LaravelErrorHandler;
