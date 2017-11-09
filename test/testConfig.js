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

envs.staging = envs.production;
envs.test = envs.production;

export default envs;