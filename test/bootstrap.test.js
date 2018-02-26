/* global test, expect */

import { AppBootstrap, Http } from '../src';
import packag from './testPackage.json';
import envs from './testConfig.js';
import AMStorage from '../src/storage';
import localStorageMock from './localStorageMock';

// Fake localStorage to run test
let storage = new AMStorage(localStorageMock);

test('Bootstrap some app', () => {
    // Test to validate appBootstrap
    let callbacks = {
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

    let result = AppBootstrap.setup('web', packag, envs, storage, callbacks);
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
