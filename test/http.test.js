/* global test, expect, jest */

import Http from '../src/http';
import fetch from 'node-fetch';
import nock from 'nock';

jest.setTimeout(1000);

test('Simple setup in HTTP', () => {
    const baseURL = 'http://localhost.com:3000';
    const userId = 'thisIsAnUserId123';
    const headers = {
        'content-type': 'application/json',
        'mobile-version': '1.0.0',
        'client': 'mobile'
    };

    Http.setBaseURL(baseURL);
    Http.setEndpointParam('user', userId);
    Http.setHeaders(headers);
    Http.setFetch(fetch);

    expect(Http.baseURL).toBe(baseURL);
    expect(Http.headers).toBe(headers);
});

test('Specific setup in HTTP', () => {
    const headers = Http.headers;
    const version = '1.0.0';
    const client = 'mobile';
    const contentType = 'application/json';
    const token = 'JWT-0000000000000';

    Http.setup(version, client, contentType);
    expect(Http.headers).toEqual(headers);
    expect(Http.headers['mobile-version']).toEqual(version);
    expect(Http.headers['client']).toEqual(client);
    expect(Http.headers['content-type']).toEqual(contentType);

    Http.setAuthorization(token);
    expect(Http.headers['authorization']).toEqual(token);

});

test('[200] GET Status OK', () => {
    nock(Http.baseURL, {reqheaders: Http.headers})
        .get('/')
        .reply(200, {ok: true});
    expect.assertions(1);

    return Http.get('/').then((response) => {
        expect(response.ok).toBe(true);
    }).catch((error) => {
        expect(error).toBe(true);
    });
});

test('[404] GET Not found', () => {
    nock(Http.baseURL, {reqheaders: Http.headers}).get('/').reply(404);
    expect.assertions(1);

    return Http.get('/').then((response) => {
        expect(response).toBe(true);
    }).catch((error) => {
        expect(error.name).toBe(404);
    });
});

test('[FetchError] GET Failed to fetch', () => {
    const fetchError = {
        'errno': 'ETIMEDOUT',
        'code': 'ETIMEDOUT',
        'message': 'connect ETIMEDOUT localhost:3000'
    };

    nock(Http.baseURL, {reqheaders: Http.headers})
        .get('/')
        .replyWithError(fetchError);
    expect.assertions(1);

    return Http.get('/').then((response) => {
        expect(response).toBe(true);
    }).catch((error) => {
        expect(error.name).toBe('FetchError');
    });
});

test('Reseting Http', () => {
    Http.reset();
    expect(Http.headers).toEqual(Http.defaultHeaders);
    expect(Http.authorization).toEqual('');
});