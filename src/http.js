import Rollbar from './rollbar';
var headers = '';
var baseURL = '';
var params = {};
var requestListener = null;

class Http {
    static setBaseURL (baseURLSetup) {
        baseURL = baseURLSetup;
    }

    static setHeaders (headersSetup) {
        headers = headersSetup;
    }

    static setEndpointParam (key, value) {
        params[key] = value;
    }

    static getHeaders () {
        return headers;
    }

    static getUrl (uri) {
        let url = baseURL + uri;
        const regex = /{.*}/i;
        let matches = url.match(regex);
        if (matches) {
            // console.log('MATCHES: ', matches);
            matches.map((match) => {
                let value = params[match];
                url = url.replace(match, value);
            });
        }
        // console.log('Url:', url);
        return url;
    }

    static post (uri, body) {
        let url = Http.getUrl(uri);
        return new Promise((resolve, reject) => {
                console.log(url + ' - POST - body ', body);
                // console.log(headers);
                body = JSON.stringify(body);
                fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: body
                }).then(Http.checkStatus)
                    .then(Http.checkListener)
                    .then(Http.parseJSON)
                    .then(response => {
                        console.log('POST > ' + uri + ' > response', response);
                        resolve(response);
                    }).catch(error => {
                    if (error.message !== 'Network request failed') {
                        console.error('POST > ' + url + ' > error', error);
                    } else {
                        console.warn('POST > Network request failed -  Are you offline?');
                    }
                    reject(error);
                });
            }
        );
    }

    static put (uri, body) {
        let url = Http.getUrl(uri);
        return new Promise((resolve, reject) => {
                console.log(url + ' - PUT - body ', body);
                // console.log(headers);
                body = JSON.stringify(body);
                fetch(url, {
                    method: 'PUT',
                    headers: headers,
                    body: body
                }).then(Http.checkStatus)
                    .then(Http.checkListener)
                    .then(Http.parseJSON)
                    .then(response => {
                        console.log('PUT > ' + uri + ' > response', response);
                        resolve(response);
                    }).catch(error => {
                    if (error.message !== 'Network request failed') {
                        console.error('PUT > ' + url + ' > error', error);
                    } else {
                        console.warn('PUT > Network request failed -  Are you offline?');
                    }
                    reject(error);
                });
            }
        );
    }

    static get (uri) {
        let url = Http.getUrl(uri);
        return new Promise((resolve, reject) => {
                console.log(url + ' - GET');
                fetch(url, {
                    method: 'GET',
                    headers: headers
                }).then(Http.checkListener)
                    .then(Http.checkStatus)
                    .then(Http.parseJSON)
                    .then(response => {
                        console.log(url + ' response', response);
                        resolve(response);
                    }).catch(error => {
                    if (error.message !== 'Network request failed') {
                        console.error('GET > ' + url + ' > error', error);
                    } else {
                        console.warn('GET > Network request failed -  Are you offline?');
                    }
                    reject(error);
                });
            }
        );
    }

    static delete (uri, body) {
        let url = Http.getUrl(uri);
        return new Promise((resolve, reject) => {
                console.log(url + ' - DELETE');
                // console.log(headers);
                fetch(url, {
                    method: 'DELETE',
                    headers: headers,
                    body: body
                }).then(Http.checkListener)
                    .then(Http.checkDeleteStatus)
                    .then(response => {
                        console.log(url + ' response', response);
                        resolve(response);
                    }).catch(error => {
                    if (error.message !== 'Network request failed') {
                        console.error('DELETE > ' + url + ' > error', error);
                    } else {
                        console.warn('DELETE > Network request failed -  Are you offline?');
                    }
                    reject(error);
                });
            }
        );
    }

    static checkStatus (response) {
        // console.log('checkStatus');
        if (response.status === 200 || response.status === 201) { // 200 - OK || 201 - Created
            return response;
        } else {
            return response.text().then(data => {
                // console.error('Error Message', data);
                let err = {};
                err.stack = new Error().stack;
                err.name = response.status;
                err.message = data;

                // Log it on rollbar
                Rollbar.error(err);

                throw err;
            });
        }
    }

    static checkListener (response) {
        // console.log("checkListener",requestListener);
        if (requestListener) {
            requestListener(response);
        }
        return response;
    }

    static checkDeleteStatus (response) {
        if (response.status === 200 || response.status === 204) {
            return response;
        } else {
            return response.text().then(data => {
                // console.error(data);
                let err = {};
                err.stack = new Error().stack;
                err.name = response.status;
                err.message = data;

                // Log it on rollbar
                Rollbar.error(err);

                throw err;
            });
        }
    }

    static parseJSON (response) {
        // console.log('parseJSON');
        return response.json();
    }

    static setRequestListener (callback) {
        requestListener = callback;
    }
}

export default Http;
