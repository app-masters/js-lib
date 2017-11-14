# JS-Lib

### AppBoostrap

App Masters default app setup process.

Create a config file with defaults environments:

```

const envs = {};

envs.development = {
    baseUrl: "http://localhost:3000/api",
    uploadCareToken: "someXPTOtoken",
    rollbarToken: "anotherCrazyToken"
};

envs.development_firebase = {
    baseUrl: "https://remotehost-dev.herokuapp.com:3000/api",
    uploadCareToken: "someXPTOtoken",
    rollbarToken: "anotherCrazyToken"
};

envs.staging = {
    baseUrl: "https://remotehost-staging.herokuapp.com:3000/api",
    uploadCareToken: "someXPTOtoken",
    rollbarToken: "anotherCrazyToken"
};

envs.production = {
    baseUrl: "https://remotehost-prod.herokuapp.com:3000/api",
    uploadCareToken: "someXPTOtoken",
    rollbarToken: "anotherCrazyToken"
};

export default envs;

```

Import and call AppBootstrap:


````
import {store, storage} from './store';
import packag from '../package.json';
import envs from './config';
import {AppBootstrap} from '@app-masters/js-lib';

class App extends Component {
    constructor () {
        super();
        try {
            let callbacks = {
                onMinVersionNotSatifies: (version) => {
                    alert("Você deve atualizar sua versão agora! Por favor recarregue a página, se a mensagem continuar, limpe o cache do navegador.");
                },
                onNewVersion: (version) => {
                    alert('Bem vindo à nova versão!');
                    if (version === '0.2.0') {
                      // Some new version decision
                    }
                },
                onUncaughtError: (e) => {
                    if (e.message !== 'Failed to fetch') {
                        Rollbar.error(e);
                        alert("Houve um erro inesperado e os programadores responsáveis já foram avisados. \n\n Detalhes técnicos: " + e.message);
                    } else {
                        alert('Falha na conexāo');
                    }
                }
            };

            // Bootstrap
            AppBootstrap.setup("web", packag, envs, storage, callbacks);
        } catch (e) {
            alert("Houve um erro inesperado e os programadores responsáveis já foram avisados. \n\n Detalhes técnicos: " + e.message);
        }
    }
}

````

(callbacks are the same object used with AMActions.setup()).



# Change Log

Check all changes on [changelog](CHANGELOG.md).