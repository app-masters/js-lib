# JS-Lib

## Http

App Masters fetch class.

### Configuration

On the project setup, set the base url for your API and the necessary headers:

````javascript
import { Http } from '@app-masters/js-lib';

...

const version = '1.0.0'; // get from package.json
const client = 'mobile'; // use 'mobile', 'admin' or 'web'
const env = 'development'; // use 'development', 'staging' or 'production'
const contentType = 'application/json';
const baseURL = 'http://localhost.com:3000';
const token = 'JWT-0000000000000'; // user's authentication token

Http.setup(version, client, env, contentType);
Http.setBaseURL(baseURL);

// after the authentication process
Http.setAuthorization(token);

````

Setting your headers like this, will give you this headers:

````javascript
{
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'mobile-version': '1.0.0',
    'client': 'mobile',
    'client-env': 'development',
    'authorization': 'JWT-0000000000000'
}
````

Also, you can set a endpoint param. This param is a key/value that will overwrite the key with the value every time that it's found in a fetch call.

Examples:

````javascript

Http.setEndpointParam('{_userID}', user.id);
Http.setEndpointParam('{_maxItems}', 5);

...

Http.get('/{_userID)');
Http.get('/items/?quantity={_maxItems}');
````

Anytime you can reset the headers to the default setup using ``Http.reset()``. This will reset your headers to what was set in ``Http.setup()``, removing the ``authorization`` and all endpoint parameters.

### Usage

The Http class have 4 main asynchronous methods for fetch: ``GET``, ``POST``, ``PUT`` and ``DELETE``. After you set the base URL, you only need to pass the endpoint to fetch it.

Examples:

````javascript

Http.get('/users').then(response => {
    console.log(response);
}).catch(error => {
    console.error(error);
});

// Using endpoint params
Http.get('/users/{_userID}').then(response => {
    console.log(response);
}).catch(error => {
    console.error(error);
});

Http.post('/users', {email: 'new@email.com'}).then(response => {
    console.log(response);
}).catch(error => {
    console.error(error);
});

// Full URLs ignore the baseURL set.
Http.post('http://localhost.com:3001/otherUsers', {email: 'new@email.com'}).then(response => {
    console.log(response);
}).catch(error => {
    console.error(error);
});

Http.put('/users/TH1S154U53R1D', {email: 'other@email.com'}).then(response => {
    console.log(response);
}).catch(error => {
    console.error(error);
});

Http.delete('/users/TH1S154U53R1D').then(response => {
    console.log(response);
}).catch(error => {
    console.error(error);
});
````

The status codes considered as success are: 200, 201 and 204 (on delete).

## AppBoostrap

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

## Notification (web)
### Service worker configuration
- Create a file called 'firebase-messaging-sw.js' with the following content and put it on the public path of the project (generaly it is project-folder/public):
```javascript
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
firebase.initializeApp({
    messagingSenderId: "1072711350296"
});
const Notifier = firebase.messaging();
Notifier.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});
```
- Add the following line on the index.html before the closing tag: `</html>`
```html
<html>
    <head>...</head>
    <body>...</body>
    <!-- add this script -->
    <script src="https://www.gstatic.com/firebasejs/4.4.0/firebase.js"></script>
</html>
```

### Firebase initialize and lib setup
-  Initialize the firebase and then setup the notification lib
```javascript
// initializing the firebase
firebase.initializeApp({
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
});
// lib setup
Notification.setup(firebase);
Notification.getToken((token) => console.log('It has the token! Notification should work fine', token));
Notification.handleMessage((message) => {console.log('message received -> ', message)}, console.error);
```

### Lib methods
#### setup
- Receives the config param (can be a firebase instance or config params to set the cordova firebase plugin for example), sets the device info (cordova, web, native) and finnaly sets the messaging (object used to make all the firebase calls).

# Change Log

Check all changes on [changelog](CHANGELOG.md).
