import { Organization } from './organization.model';
import { Role } from './role.model';

export class User {
    id: string;
    picture: string;
    displayName: string;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    jobTitle: string;
    email?: string;
    roleGroup: string;
    mobile?: string;
    timeZone: string;
    language: string;
    defaultOrganizationId: string;
    defaultOrganization: string;
    status: number;
    companyId?: string;
    company?: Organization;
    lastModifiedBy?: Date;
    emailAddress:string;
    phoneNumber: number;
    activated: number;
    roles: Role[];

    getRoleNames() {
        let roleNames = "*";
        if (this.roles != null && this.roles != undefined) {
            for(let i = 0;i < this.roles.length; i++) {
                if (roleNames === "*") {
                    roleNames = this.roles[i].name;
                }
                else {
                    roleNames += ","+ this.roles[i].name;
                }
            }
        }
        return roleNames;
    }
}
