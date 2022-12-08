import { ContactPersion } from './contact-person.model';
import { Service } from './service.model';
import { GeoLocation } from './geolocation.model';

export class Organization {
    id: string;
    name: string;
    location: GeoLocation;
    address: string;
    website: string;
    currency: string;
    email: string;
    phone: string;
    contact: ContactPersion;
    service: Service;
    smallLogo: string;
    logo: string;
    status: string;
    createdBy: string;
    createdOn: Date;
    groupId: string;
}
