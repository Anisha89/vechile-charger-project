// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.




export const environment = {
  production: false,
  //googleApiKey_Old: 'AIzaSyBPB3rdL7DrXneYEzHWWLY1OK6rUuPRuEI',
  googleApiKey:'AIzaSyCuf6OFP7FK07lXhpjItVD9tSwGXvDFJoQ',
  encoding: "base64",
  rcpaiService : {
    host: 'localhost',
    port: 8082,
    protocol: 'http://',
    context: 'mysql',
    token: {
      authorizationUrl: '/api/authenticate',
      requestHeaders: {
        'Content-Type': 'application/json'
      },
      requestBody : {
        'username': 'user',
        'password': 'user',
        'rememeberMe': true
      }
    }
  },
  ciService : {
    host: 'localhost',
    port: 8080,
    protocol: 'http://',
    context: 'cassandra',
    token: {
      authorizationUrl: '/api/authenticate',
      requestHeaders: {
        'Content-Type': 'application/json'
      },
      requestBody : {
        'username': 'user',
        'password': 'user',
        'rememeberMe': true
      }
    }
  }
};
