import { Organization } from './organization.model';

export class Department {
    id: string;
    name: string;
    facilityId: string;
    companyName: string;
    emailId: string;
    phones: string;
    contactName: string;
    contactPhone: string;
    contactMobile: string;
    contactEmail: string;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
    status: number;
    tags: string;
    companyId: string;
    company: Organization;
}