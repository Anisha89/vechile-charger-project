import { Facility } from './facility.model';
import { ChargingVehicle } from './charging-vehicle.model';
import { ChargingTerminal } from './charging-terminal.model';

export class Alarm {
    id: string;
    facility: string;
    chargingVehicle: string;
    chargingTerminal: string;
    alarm: string;
    description: string;
    priority: number;
    status: string;
    triggerTime: Date;
    normalizedTime: Date;
}
