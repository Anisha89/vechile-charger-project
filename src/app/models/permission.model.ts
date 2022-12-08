export class Permission {
    id:number;
    permissionType:string;
    permissionName:string;
}

export class PermissionList {
    permissions:Permission[];
    init(pPermissions:Permission[]) {
        this.permissions = pPermissions;
    }
    getPermission(pId:Number) {
        this.permissions.forEach(permission => {
            if (permission.id === pId) {
                return permission;
            }
        });
        return null;
    }
}