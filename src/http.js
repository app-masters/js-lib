import Rollbar from './rollbar';

class Http {
    static setup (version, client, contentType) {
        let headers = {};
        headers['content-type'] = contentType;
        headers[client + '-version'] = version;
        headers['client'] = 'mobile';
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

    static download (uri) {
        let url = Http.getUrl(uri);
        return new Promise((resolve, reject) => {
                console.log(url + ' - GET');
                Http.fetch(url, {
                    method: 'GET',
                    headers: Http.headers
                }).then(Http.checkListener)
                    .then(Http.checkStatus)
                    .then(response => {
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
                err.message = data || 'error with no message';

                // Log it on rollbar
                Rollbar.error(err);

                throw err;
            });
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
            return response.text().then(data => {
                // console.error(data);
                let err = {};
                err.stack = new Error().stack;
                err.name = response.status;
                err.message = data || 'error with no message';

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
