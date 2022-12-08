export const environment = {
  production: true,
  //googleApiKey_Old: 'AIzaSyBPB3rdL7DrXneYEzHWWLY1OK6rUuPRuEI',
  googleApiKey:'AIzaSyCuf6OFP7FK07lXhpjItVD9tSwGXvDFJoQ',
  encoding: "base64",
  rcpaiService : {
    host: '66.175.238.218',
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
    host: '66.175.238.218',
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