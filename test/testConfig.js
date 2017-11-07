const envs = {};

let rollbar = {
    accessToken: "someToken",
    logOnDev: false
};

envs.development = {
    baseUrl: "http://localhost:3000/api",
    rollbar
};

envs.production = {
    baseUrl: "http://remote:3000/api",
    rollbar
};

envs.staging = envs.production;
envs.test = envs.production;

export default envs;