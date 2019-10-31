/* global test, expect */

import {AppBootstrap, Http} from '../src';
import packag from './testPackage.json';
import envs from './testConfig.js';
import AMStorage from '../src/storage';
import localStorageMock from './localStorageMock';
import VersionCheck from "../src/version";

// Fake localStorage to run test
let storage = new AMStorage(localStorageMock);

// Test to validate appBootstrap
const callbacks = {
    onMinVersionNotSatifies: (version) => {
        alert('Você deve atualizar sua versão agora! Por favor recarregue a página, se a mensagem continuar, limpe o cache do navegador.');
    },
    onNewVersion: (version) => {
        alert('Bem vindo à nova versão!');
        if (version === '0.2.0') {
            // apagar arquivos do cache de imagens
            // Limpar storage de items
            // Apagar dado de autenticação e avisar ao usuário que o beta acabou (ter if)
        }
    },
    onUncaughtError: (e) => {
        alert('Houve um erro inesperado e os programadores responsáveis já foram avisados. \n\n Detalhes técnicos: ' + e.message);
    },
    onAPIFail: (e) => {
        console.log('some is wrong in API, wait for the next update');
    },
    onConnectionFail: (e) => {
        console.log('connection failed');
    }
};

test('Bootstrap some app', () => {
    let result = AppBootstrap.setup('web', 'web', packag.version, envs, storage, callbacks);
    expect(result).toBe(true);
});

test('Http bootstrap', () => {
    expect(Http.headers).toEqual({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'client': 'web',
        'client-env': process.env.NODE_ENV,
        'web-version': packag.version
    });
});


test('Check minVersionSatisfies - web', () => {
    // Current client version is 1.0.1 (packag.version)
    // Should accept
    const req = {
        headers: {
            'client': 'web',
            'min-web-version': '1.0.0',
        }
    };
    req.headers.get = (key) => {
        return req.headers[key];
    };
    expect(VersionCheck.minVersionSatisfies(req)).toBe(true);

    // Should complaing
    const req2 = {
        headers: {
            'client': 'web',
            'min-web-version': '1.2.0',
        }
    };
    req2.headers.get = (key) => {
        return req2.headers[key];
    };
    expect(VersionCheck.minVersionSatisfies(req2)).toBe(false);
});

test('Check minVersionSatisfies - mobile', () => {
    process.env.__DEV__ = true;
    let result = AppBootstrap.setup('mobile', 'android', packag.version, envs, storage, callbacks);
    expect(result).toBe(true);

    // Current client version is 1.0.1 (packag.version)
    // Should accept
    const req = {
        headers: {
            'client': 'web',
            'min-mobile-version': '1.0.0',
        }
    };
    req.headers.get = (key) => {
        return req.headers[key];
    };
    expect(VersionCheck.minVersionSatisfies(req)).toBe(true);

    // Should complaing
    const req2 = {
        headers: {
            'client': 'web',
            'min-mobile-version': '1.2.0',
        }
    };
    req2.headers.get = (key) => {
        return req2.headers[key];
    };
    expect(VersionCheck.minVersionSatisfies(req2)).toBe(false);
});

test('Check minVersionSatisfies - mobile android', () => {
    process.env.__DEV__ = true;
    let result = AppBootstrap.setup('mobile', 'android', packag.version, envs, storage, callbacks);
    expect(result).toBe(true);

    // Current client version is 1.0.1 (packag.version)
    // Should accept
    const req = {
        headers: {
            'client': 'web',
            'min-mobile-version': '1.0.0',
            'min-android-version': '1.0.1',
        }
    };
    req.headers.get = (key) => {
        return req.headers[key];
    };
    expect(VersionCheck.minVersionSatisfies(req)).toBe(true);

    // Should complaing
    const req2 = {
        headers: {
            'client': 'web',
            'min-mobile-version': '1.2.0',
            'min-android-version': '1.2.1',
        }
    };
    req2.headers.get = (key) => {
        return req2.headers[key];
    };
    expect(VersionCheck.minVersionSatisfies(req2)).toBe(false);
});
