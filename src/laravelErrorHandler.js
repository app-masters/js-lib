import Rollbar from './rollbar';

class LaravelErrorHandler {
    /**
     * Before send error to the view, change it and send it to Rollbar
     * @param error
     * @returns {*}
     */
    static handle (error) {
        let errorObj =  LaravelErrorHandler.errorLibrary(error);

        // If it's a valid Rollbar level, call specific method
        if (errorObj.level !== 'user'){
            Rollbar[errorObj.level](errorObj);
        }

        return errorObj;
    };

    /**
     * Change errorObj to match view needs for each status code or property
     * @param errorObj
     * @returns {*}
     */
    static errorLibrary(errorObj){

        if (errorObj.status === 405 || errorObj.status >= 500){
            // Server error, don't show original - 405 or 5XX
            errorObj.body = {error: ['Falha no servidor']};
            errorObj.level = 'critical';
        } else if (errorObj.status >= 400 && errorObj.status <= 430) {
            // User payload error - 4XX (except 405)
            const body = JSON.parse(errorObj.remote);
            if (body.error) {
                body.error = body.error.map(error => error.replace(/ *\[[^)]*\] */g, ''));
            }
            errorObj.body = body;
            errorObj.level = 'user'; // User error, don't send to Rollbar
        } else {
            // Another error (can be a error without status code)
            errorObj.body = {error: [errorObj.remote]};
            errorObj.level = 'error';
        }
        return errorObj;
    }

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


export default LaravelErrorHandler;