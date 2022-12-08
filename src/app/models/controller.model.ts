import { Organization } from './organization.model';

export class Controller {
    id: string;
    picture: string;
    companyName: string;
    company: Organization;
    companyId: string;
    serialNumber: string;
    version: string;
    description: string;
    ipAddress: string;
    macAddress: string;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
    status: number;
    tags: string;
}
