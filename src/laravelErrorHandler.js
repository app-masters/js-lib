import Rollbar from './rollbar';

class LaravelErrorHandler {
    static handle (error) {
        let errorObj =  LaravelErrorHandler.errorLibrary(error);

        if (errorObj.level){
            Rollbar[errorObj.level](errorObj);
        }

        return errorObj;
    };

    static errorLibrary(errorObj){
        if (errorObj.status === 405 || errorObj.status >= 500){
            // Server error, don't show
            errorObj.body = {error: ['Falha no servidor']};
            errorObj.level = 'critical';
        } else if (errorObj.status >= 400 && errorObj.status <= 430) {
            // Payload error
            const body = JSON.parse(errorObj.remote);
            if (body.error) {
                body.error = body.error.map(error => error.replace(/ *\[[^)]*\] */g, ''));
            }
            errorObj.body = body;
            errorObj.level = 'error';
        } else {
            // Another error (maybe a browser error)
            errorObj.body = {error: [errorObj.remote]};
            errorObj.level = 'error';
        }
        return errorObj;
    }

    static mount (response) {
        let error = {};
        error.headers = response.headers;
        error.status = response.status;
        error.statusText = response.statusText;
        error.response = response;
        error.level = null;
        return response.text().then((data) => {
            error.remote = data;
            throw error;
        });
    }
}


export default LaravelErrorHandler;