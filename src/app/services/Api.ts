// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { environment } from '../../environments/environment';

export const Api = {
    production: environment.production,
    rcpaiPort: environment.rcpaiService.port,
    ciPort: environment.ciService.port,
    scheme: 'http',
    rcpaiBaseUrI: environment.rcpaiService.host,
    ciBaseUrI: environment.ciService.host,
    loginUri : {
        uri: '/api/authenticate',
        key: 'token'
    },
    loginCIServer : {
         uri: '/api/authenticate',
         key: 'token2'
     },
    userCreate : {
        uri: '/api/users',
        key: 'token'
    },
    userUpdate : {
        uri: '/api/users',
        key: 'token'
    },
    userDelete : {
        uri: '/api/users/',
        key: 'token'
    },
    userFetchAll : {
        uri: '/api/users',
        key: 'token'
    },
    userFetch : {
        uri: '/api/users/',
        key: 'token'
    },
    getUsersBycompany:{
       uri:'/api/getusersbycompany/',
       key:'token'
    },
    userFetchAthourities : {
        uri: '/api/users/authorities',
        key: 'token'
    },
    facilityCreate : {
        uri: '/api/facilities',
        key: 'token'
    },
    facilityUpdate : {
        uri: '/api/facilities',
        key: 'token'
    },
    facilityDelete : {
        uri: '/api/facilities/',
        key: 'token'
    },
    facilityFetchAll : {
        uri: '/api/facilities',
        key: 'token'
    },
    facilityFetch : {
        uri: '/api/facilities/',
        key: 'token'
    },
    facilityFetchByCompany : {
        uri: '/api/facilities/byCompany/',
        key: 'token'
    },
    organizationCreate : {
        uri: '/api/companies',
        key: 'token'
    },
    organizationUpdate : {
        uri: '/api/companies',
        key: 'token'
    },
    organizationDelete : {
        uri: '/api/companies/',
        key: 'token'
    },
    organizationFetchAll : {
        uri: '/api/companies',
        key: 'token'
    },
    organizationFetch : {
        uri: '/api/companies/',
        key: 'token'
    },
    roleCreate : {
        uri: '/api/roles',
        key: 'token'
    },
    roleUpdate : {
        uri: '/api/roles',
        key: 'token'
    },
    roleDelete : {
        uri: '/api/roles/',
        key: 'token'
    },
    roleFetchAll : {
        uri: '/api/roles',
        key: 'token'
    },
    roleFetch : {
        uri: '/api/roles/',
        key: 'token'
    },
    rolesByCompany:{
        uri:'/api/getrolesbycompany/',
        key:'token'
    },
    controllerCreate : {
        uri: '/api/controllers',
        key: 'token'
    },
    controllerUpdate : {
        uri: '/api/controllers',
        key: 'token'
    },
    controllerDelete : {
        uri: '/api/controllers/',
        key: 'token'
    },
    controllerFetchAll : {
        uri: '/api/controllers',
        key: 'token'
    },
    controllerFetch : {
        uri: '/api/controllers/',
        key: 'token'
    },
    departmentCreate : {
        uri: '/api/departments',
        key: 'token'
    },
    departmentUpdate : {
        uri: '/api/departments',
        key: 'token'
    },
    departmentDelete : {
        uri: '/api/departments/',
        key: 'token'
    },
    departmentFetchAll : {
        uri: '/api/departments',
        key: 'token'
    },
    departmentFetch : {
        uri: '/api/departments/',
        key: 'token'
    },
    domainCreate : {
        uri: '/api/domains',
        key: 'token'
    },
    domainUpdate : {
        uri: '/api/domains',
        key: 'token'
    },
    getAssetsBycompany:{
        uri:'/api/getassetsbycompany/',
        key:'token'
     },
    domainDelete : {
        uri: '/api/domains/',
        key: 'token'
    },
    domainFetchAll : {
        uri: '/api/domains',
        key: 'token'
    },
    domainFetch : {
        uri: '/api/domains/',
        key: 'token'
    },
    domainRecord : {
        uri: '/api/domain/asset/',
        key: 'token'
    },
    domainRecordList : {
        uri: '/api/domain/',
        key: 'token'
    },
    assetDomainList : {
        uri: '/api/asset-domains',
        key: 'token'
    },
    rolePermissionList:{
       uri:'/api/permissions',
       key:'token'
    }

    // new apis for REAL TIME DATA
    ,
    getRealtimeAssetList:{
       uri:'/api/realtimeasset',
       key:'token2'
    }
    ,
    getRealtimeAsset:{
       uri:'/api/realtimeasset/',
       key:'token2'
    }
    ,
    getAlarmList:{
       uri:'/api/alarms/',
       key:'token2'
    }
    ,
    getAlarmsbydate:{
       uri:'/api/alarmsbydate/',
       key:'token2'
    }
    ,
    assetChart:{ // not yet implemented.
        uri:'/api/getchartdata',
        key:'token2'
     }
     ,
     // rule property or data points
     ruleProperty:{
        uri:'/api/ruleproperty/',
        key:'token'
     }
     ,
     rulePropertyDelete:{
        uri:'/api/ruleproperty/',
        key:'token'
     }
    ,
    rulePropertyCreate:{
       uri:'/api/ruleproperty',
       key:'token'
    },
   
    rulePropertyUodate:{
       uri:'/api/ruleproperty',
       key:'token'
    },

    // rule engine
    ruleEngine:{
        uri:'/api/ruleengine/',
        key:'token'
    },

    ruleEngineDelete:{
        uri:'/api/ruleengine/',
        key:'token'
    },

    ruleEngineList:{
        uri:'/api/ruleengine',
        key:'token'
    },
   
    rulePropertyList:{
        uri:'/api/ruleproperty',
        key:'token'
     },
   
     ruleEngineCreate:{
        uri:'/api/ruleengine',
        key:'token'
    },
    ruleEngineUpdate:{
        uri:'/api/ruleengine',
        key:'token'
    },
    getRulesBycompany:{
        uri:'/api/ruleenginebycompany/',
        key:'token'
     },
};

export enum ServerType {
    rcpaiServer = 0,
    ciServer=1    
}

export function getServer(serverType : ServerType) {
    let server : string = "";
    switch(serverType) {
         case ServerType.ciServer:
            server = Api.scheme + '://' + Api.ciBaseUrI + ':' + Api.ciPort;
            break;
        default: //case ServerType.rcpaiServer:
            server = Api.scheme + '://' + Api.rcpaiBaseUrI + ':' + Api.rcpaiPort;
         break;
    }
    return server;
}


export function getServerToken(serverUrl : String) {
    let token : string = localStorage.getItem(Api.loginUri.key);
    if (serverUrl.indexOf(getServer(ServerType.ciServer)) >= 0 ){
        token = localStorage.getItem(Api.loginCIServer.key);  
    }
    /*else if (serverUrl.indexOf(getServer(ServerType.rcpaiServer)) >= 0 ) {
        token : localStorage.getItem(Api.loginUri.key);
    }*/
    return token;
}