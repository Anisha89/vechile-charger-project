import { GeoLocation } from './geolocation.model';

export class ChargingVehicle {
    id: string;
    assetSerialNumber: string;
    model: string;
    make: string;
    totalCapacity: number;
    address: string;
    assetType: string;
    picture: string;
    status: string;
    location: GeoLocation;
    facilityId: string;
    organizationId: string;
}
