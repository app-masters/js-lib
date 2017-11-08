import AppBootstrap from '../src/appBootstrap';
import packag from './testPackage.json';
import envs from './testConfig.js';
import AMStorage from '../src/storage';
import localStorageMock from './localStorageMock';

// Fake localStorage to run test
let storage = new AMStorage(localStorageMock);

test('Bootstrap some app', () => {
    // Test to validate appBootstrap
    let callcabks = {
        onMinVersionNotSatifies: (version) => {
            alert("Você deve atualizar sua versão agora! Por favor recarregue a página, se a mensagem continuar, limpe o cache do navegador.");
        },
        onNewVersion: (version) => {
            alert('Bem vindo à nova versão!');
            if (version === '0.2.0') {
                // apagar arquivos do cache de imagens
                // Limpar storage de items
                // Apagar dado de autenticação e avisar ao usuário que o beta acabou (ter if)
            }
        }
    };

    let result = AppBootstrap("web", packag, envs, storage, callcabks);
    expect(result).toBe(true);
});