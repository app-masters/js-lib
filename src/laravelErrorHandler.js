import Rollbar from "./rollbar";

class LaravelErrorHandler {
    static handle (error) {
        let errorObj =  error;
        errorObj.remote = error; // Keep the original error on payload
        errorObj.level = null; // Default level

        errorObj = LaravelErrorHandler.errorLibrary(errorObj);

        if (errorObj.level){
            Rollbar[errorObj.level](errorObj);
        }

        return errorObj;
    };

    static errorLibrary(errorObj){
        if (errorObj.status >= 500){
            errorObj.body = {error: ['Falha no servidor']};
            errorObj.level = 'critical';
        } else if (isNaN(errorObj.status)) {
            if(!errorObj.body || !errorObj.body.error){
                errorObj.body = {error: [errorObj.body]}
            }
            errorObj.level = 'error';
        }
        return errorObj;
    }

    static mount (response) {
        let error = {};
        error.headers = response.headers;
        error.status = response.status;
        error.statusText = response.statusText;
        return response.json().then((data) => {
            error.body = data || {error: ['Ocorreu um erro inesperado']};
            throw error;
        });
    }
}


export default LaravelErrorHandler;