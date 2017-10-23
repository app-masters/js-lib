'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rollbar = require('./rollbar');

var _rollbar2 = _interopRequireDefault(_rollbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var headers = '';
var baseURL = '';
var params = {};
var requestListener = null;

var Http = function () {
    function Http() {
        _classCallCheck(this, Http);
    }

    _createClass(Http, null, [{
        key: 'setBaseURL',
        value: function setBaseURL(baseURLSetup) {
            baseURL = baseURLSetup;
        }
    }, {
        key: 'setHeaders',
        value: function setHeaders(headersSetup) {
            headers = headersSetup;
        }
    }, {
        key: 'setEndpointParam',
        value: function setEndpointParam(key, value) {
            params[key] = value;
        }
    }, {
        key: 'getHeaders',
        value: function getHeaders() {
            return headers;
        }
    }, {
        key: 'getUrl',
        value: function getUrl(uri) {
            var url = baseURL + uri;
            var regex = /{.*}/i;
            var matches = url.match(regex);
            if (matches) {
                // console.log('MATCHES: ', matches);
                matches.map(function (match) {
                    var value = params[match];
                    url = url.replace(match, value);
                });
            }
            // console.log('Url:', url);
            return url;
        }
    }, {
        key: 'post',
        value: function post(uri, body) {
            var url = Http.getUrl(uri);
            return new Promise(function (resolve, reject) {
                console.log(url + ' - POST - body ', body);
                // console.log(headers);
                body = JSON.stringify(body);
                fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: body
                }).then(Http.checkStatus).then(Http.checkListener).then(Http.parseJSON).then(function (response) {
                    console.log('POST > ' + uri + ' > response', response);
                    resolve(response);
                }).catch(function (error) {
                    if (error.message !== 'Network request failed') {
                        console.error('POST > ' + url + ' > error', error);
                    } else {
                        console.warn('POST > Network request failed -  Are you offline?');
                    }
                    reject(error);
                });
            });
        }
    }, {
        key: 'put',
        value: function put(uri, body) {
            var url = Http.getUrl(uri);
            return new Promise(function (resolve, reject) {
                console.log(url + ' - PUT - body ', body);
                // console.log(headers);
                body = JSON.stringify(body);
                fetch(url, {
                    method: 'PUT',
                    headers: headers,
                    body: body
                }).then(Http.checkStatus).then(Http.checkListener).then(Http.parseJSON).then(function (response) {
                    console.log('PUT > ' + uri + ' > response', response);
                    resolve(response);
                }).catch(function (error) {
                    if (error.message !== 'Network request failed') {
                        console.error('PUT > ' + url + ' > error', error);
                    } else {
                        console.warn('PUT > Network request failed -  Are you offline?');
                    }
                    reject(error);
                });
            });
        }
    }, {
        key: 'get',
        value: function get(uri) {
            var url = Http.getUrl(uri);
            return new Promise(function (resolve, reject) {
                console.log(url + ' - GET');
                fetch(url, {
                    method: 'GET',
                    headers: headers
                }).then(Http.checkListener).then(Http.checkStatus).then(Http.parseJSON).then(function (response) {
                    console.log(url + ' response', response);
                    resolve(response);
                }).catch(function (error) {
                    if (error.message !== 'Network request failed') {
                        console.error('GET > ' + url + ' > error', error);
                    } else {
                        console.warn('GET > Network request failed -  Are you offline?');
                    }
                    reject(error);
                });
            });
        }
    }, {
        key: 'delete',
        value: function _delete(uri, body) {
            var url = Http.getUrl(uri);
            return new Promise(function (resolve, reject) {
                console.log(url + ' - DELETE');
                // console.log(headers);
                fetch(url, {
                    method: 'DELETE',
                    headers: headers,
                    body: body
                }).then(Http.checkListener).then(Http.checkDeleteStatus).then(function (response) {
                    console.log(url + ' response', response);
                    resolve(response);
                }).catch(function (error) {
                    if (error.message !== 'Network request failed') {
                        console.error('DELETE > ' + url + ' > error', error);
                    } else {
                        console.warn('DELETE > Network request failed -  Are you offline?');
                    }
                    reject(error);
                });
            });
        }
    }, {
        key: 'checkStatus',
        value: function checkStatus(response) {
            // console.log('checkStatus');
            if (response.status === 200 || response.status === 201) {
                // 200 - OK || 201 - Created
                return response;
            } else {
                return response.text().then(function (data) {
                    // console.error('Error Message', data);
                    var err = {};
                    err.stack = new Error().stack;
                    err.name = response.status;
                    err.message = data;

                    // Log it on rollbar
                    _rollbar2.default.error(err);

                    throw err;
                });
            }
        }
    }, {
        key: 'checkListener',
        value: function checkListener(response) {
            // console.log("checkListener",requestListener);
            if (requestListener) {
                requestListener(response);
            }
            return response;
        }
    }, {
        key: 'checkDeleteStatus',
        value: function checkDeleteStatus(response) {
            if (response.status === 200 || response.status === 204) {
                return response;
            } else {
                return response.text().then(function (data) {
                    // console.error(data);
                    var err = {};
                    err.stack = new Error().stack;
                    err.name = response.status;
                    err.message = data;

                    // Log it on rollbar
                    _rollbar2.default.error(err);

                    throw err;
                });
            }
        }
    }, {
        key: 'parseJSON',
        value: function parseJSON(response) {
            // console.log('parseJSON');
            return response.json();
        }
    }, {
        key: 'setRequestListener',
        value: function setRequestListener(callback) {
            requestListener = callback;
        }
    }]);

    return Http;
}();

exports.default = Http;