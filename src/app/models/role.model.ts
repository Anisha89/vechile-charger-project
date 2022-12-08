import { Organization } from './organization.model';
import { Permission } from './permission.model';

export class Role {
    id: string;
    name: string;
    description: string;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
    status: number;
    tags: string;
    company: Organization; // no data from api server & we are not sending the compnay details.
    companyId: string;
    companyName: string;
    permissions:Permission[];
    getPermissionNames() {
        let names = Array<String>();
        let tempPermissions = this.permissions;
        if (tempPermissions != null) {
            tempPermissions.forEach(permission => {
            names.push(permission.permissionName);
        });
        }
        return names;
    }
    hello() {
        return "hello";
    }

    getPermissions() {
        let permissionNames = Array<String>();
        const tPermissions = this.permissions;
        
        if (tPermissions != null ) {
            tPermissions.forEach(tPermission => {
            let permissionName = tPermission.permissionName;
            if (permissionNames.indexOf(permissionName) <0 ) {
                permissionNames.push(permissionName);
            }
            }); 
        }
        return permissionNames;
    }
}

export class RolesMgr {
    roles : Role[];
    constructor() {
    }
    
    init(roles : Role[]) {
        this.roles = roles;
    }

    getAllRoleNames() {
        let matches = new Array<String>();
        const tRoles = this.roles
        tRoles.forEach(role => {
            matches.push(role.name)
        });
        return matches;
    }

    getRoleById(id:String) {
        const tRoles = this.roles
        tRoles.forEach(role => {
            if (role.id === id) {
                return role;
            }
        });
        return null;
    }
    getRoleByName(name:String) {
        const tRoles = this.roles
        tRoles.forEach(role => {
            if (role.name === name) {
                return role;
            }
        }); 
        return null;
    }

    getRolesByName(names:String[]) {
        const tRoles = this.roles
        let matches = new Array<Role>();
        names.forEach(name => {
            tRoles.forEach(role => {
                if (role.name === name) {
                    matches.push(role);
                }
            }); 
        }); 
        return matches;
    }

    getRolesById(ids:String[]) {
        const tRoles = this.roles
        let matches = new Array<Role>();
        ids.forEach(id => {
            tRoles.forEach(role => {
                if (role.name === id) {
                    matches.push(role);
                }
            }); 
        }); 
        return matches;
    }
    getPermissions() {
        let loggedInUserPermissions = Array<String>();
        const tRoles = this.roles;
        if (tRoles != null) {
            tRoles.forEach(role => {
                let tPermissions = role.getPermissions();
                if (tPermissions != null && tPermissions.length > 0) {
                    loggedInUserPermissions.concat(tPermissions);
                }
            }); 
        }
        return loggedInUserPermissions;
    }
}

export class IdAndName {

    constructor(pId:String, pName: String) {
        this.id = pId;
        this.name = pName;
    }
    id: String;
    name: String;
}

export class IdNameMap {
    idNameMap = new Map();
    constructor() {
    }
    init(item: any[]) {
        item.forEach(item => {
            this.idNameMap.set(item.id, item.name);
        });
    }
  
    getName(id:String) {
        return this.idNameMap.get(id);
    }

    getIdAndName(id:Number) {
        return {id: id, name: this.idNameMap.get(id)};
    }

    getByValue(pName:String) {
        for (let [id, name] of this.idNameMap.entries()) {
          if (name === pName)
            return id;
        }
      }

    getAsList() {
        let items = [];
        for (let [id, name] of this.idNameMap.entries()) {
            items.push({id: id, name: this.idNameMap.get(id)});
        }
        return items;
    }

    // refer this sample if any issue in iterating the arrays or collectiions.
    getMatchList(selectedRoles:Role[]) {
        let items = Array<IdAndName>();
        for(let i = 0;i < selectedRoles.length; i++) {
            if (this.idNameMap.has(selectedRoles[i].id)) {
                items.push(new IdAndName(selectedRoles[i].id, selectedRoles[i].name));   
              }
        }
        return items;
    }
}

export class RoleMap extends IdNameMap {
    constructor() {
        super();
    }
    init(items: Role[]) {
        items.forEach(item => {
            this.idNameMap.set(item.id, item.name);
        });
    }
}
