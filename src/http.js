import ErrorHandler from './httpErrorHandler';

class Http {
    static setup (version, client, env, contentType) {
        let headers = {};
        headers['Content-Type'] = contentType;
        headers['Accept'] = contentType;
        headers['client'] = client;
        headers['client-env'] = env;
        headers[client + '-version'] = version;
        Http.defaultHeaders = headers;
        Http.headers = headers;
    }

    static reset () {
        Http.headers = Http.defaultHeaders;
        Http.authorization = '';
        Http.params = {};
    }

    static setAuthorization (token) {
        Http.authorization = token;
        Http.headers = {...Http.defaultHeaders, authorization: token}
    }

    static setFetch (fetchMethod) {
        Http.fetch = fetchMethod;
    }

    static setBaseURL (baseURLSetup) {
        Http.baseURL = baseURLSetup;
    }

    static setHeaders (headersSetup) {
        console.warn('Http.setHeaders is deprecated. Consider use Http.setup(version, client, env, contentType) instead.');
        Http.headers = headersSetup;
    }

    static setEndpointParam (key, value) {
        Http.params[key] = value;
    }

    static getHeaders () {
        return Http.headers;
    }

    static getUrl (uri) {
        if (!Http.fetch) {
            throw new Error('This environment don\'t have the window.fetch. ' +
                'Please set a custom fetch method using Http.setFetch().');
        }
        let url = null;
        if (!uri.startsWith('http'))
            url = Http.baseURL + uri;
        else
            url = uri;
        const regex = /{.*}/i;
        let matches = url.match(regex);
        if (matches) {
            matches.map((match) => {
                let value = Http.params[match];
                url = url.replace(match, value);
            });
        }
        return url;
    }

    static post (uri, body) {
        let url = Http.getUrl(uri);
        return new Promise((resolve, reject) => {
                console.log(url + ' - POST - body ', body);
                // console.log(headers);
                body = JSON.stringify(body);
                Http.fetch(url, {
                    method: 'POST',
                    headers: Http.headers,
                    body: body
                }).then(Http.checkStatus)
                    .then(Http.checkListener)
                    .then(Http.parseJSON)
                    .then(response => {
                        console.log('POST > ' + uri + ' > response', response);
                        resolve(response);
                    }).catch(error => {
                    error = ErrorHandler.handle(error);
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
                Http.fetch(url, {
                    method: 'PUT',
                    headers: Http.headers,
                    body: body
                }).then(Http.checkStatus)
                    .then(Http.checkListener)
                    .then(Http.parseJSON)
                    .then(response => {
                        console.log('PUT > ' + uri + ' > response', response);
                        resolve(response);
                    }).catch(error => {
                    error = ErrorHandler.handle(error);
                    reject(error);
                });
            }
        );
    }

    static get (uri) {
        let url = Http.getUrl(uri);
        return new Promise((resolve, reject) => {
                console.log(url + ' - GET');
                Http.fetch(url, {
                    method: 'GET',
                    headers: Http.headers
                }).then(Http.checkStatus)
                    .then(Http.checkListener)
                    .then(Http.parseJSON)
                    .then(response => {
                        console.log(url + ' response', response);
                        resolve(response);
                    }).catch(error => {
                    error = ErrorHandler.handle(error);
                    reject(error);
                });
            }
        );
    }

    static download (uri) {
        let url = Http.getUrl(uri);
        return new Promise((resolve, reject) => {
                console.log(url + ' - DOWNLOAD');
                Http.fetch(url, {
                    method: 'GET',
                    headers: Http.headers
                }).then(Http.checkListener)
                    .then(Http.checkStatus)
                    .then(response => {
                        resolve(response);
                    }).catch(error => {
                    error = ErrorHandler.handle(error);
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
                Http.fetch(url, {
                    method: 'DELETE',
                    headers: Http.headers,
                    body: body
                }).then(Http.checkDeleteStatus)
                    .then(Http.checkListener)
                    .then(response => {
                        console.log(url + ' response', response);
                        resolve(response);
                    }).catch(error => {
                    error = ErrorHandler.handle(error);
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
            return ErrorHandler.mount(response);
        }
    }

    static checkListener (response) {
        // console.log("checkListener",requestListener);
        if (Http.requestListener) {
            Http.requestListener(response);
        }
        return response;
    }

    static checkDeleteStatus (response) {
        if (response.status === 200 || response.status === 204) {
            return response;
        } else {
            return ErrorHandler.mount(response);
        }
    }

    static parseJSON (response) {
        // console.log('parseJSON');
        return response.json();
    }

    static setRequestListener (callback) {
        Http.requestListener = callback;
    }
}

Http.headers = {};
Http.defaultHeaders = {};
Http.authorization = '';
Http.baseURL = '';
Http.params = {};
Http.requestListener = null;
Http.fetch = typeof fetch !== 'undefined' ? window.fetch.bind(window) : null;

export default Http;
