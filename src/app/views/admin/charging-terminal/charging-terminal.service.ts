import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/base.service';
import { Observable } from 'rxjs';
import { ChargingTerminal } from '../../../models/charging-terminal.model';
import { AppService } from '../../../app.service';
import { AppContext } from '../../../app.context';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ChargingTerminalService extends BaseService {

    constructor(
        appContext: AppContext,
        http: HttpClient
    ) {
        super(appContext, http);
        this.initialize();
    }

    getAll(): Observable<any> {
        return this._get(`chargingTerminal`);
    }

    create(chargingTerminal: ChargingTerminal): Observable<any> {
        return this._post(`chargingTerminal`, chargingTerminal);
    }

    update(chargingTerminal: ChargingTerminal): Observable<any> {
        return this._put(`chargingTerminal`, chargingTerminal);
    }

    delete(chargingTerminalId: string): Observable<any> {
        return this._delete(`chargingTerminal/${chargingTerminalId}`);
    }

    get(chargingTerminalId: string): Observable<any> {
        return this._get(`chargingTerminal/${chargingTerminalId}`);
    }

    getByChargingVehicleId(chargingVehicleId: string): Observable<any> {
        return this._get(`chargingTerminal?chargingVehicleId=${chargingVehicleId}`);
    }

    getByOrganization(organizationId: string): Observable<any> {
        return this._get(`chargingTerminal?organizationId=${organizationId}`);
    }

    private initialize() {
        const chargingTerminals: ChargingTerminal[] = [
            {
                id: this.generateId(12),
                capacity: '4',
                make: 'Fast charger 1',
                model: 'port 1',
                price: 0.25,
                equipment: 'Electric vehicle supply equipment (EVSE )',
                status: 'ACTIVE',
                chargingVehicleId: this.generateId(8),
                organizationId: this.generateId(3)
            },
            {
                id: this.generateId(13),
                capacity: '5',
                make: 'Fast charger 2',
                model: 'port 1',
                price: 0.25,
                equipment: 'Electric vehicle supply equipment (EVSE )',
                status: 'ACTIVE',
                chargingVehicleId: this.generateId(9),
                organizationId: this.generateId(3)
            },
            {
                id: this.generateId(14),
                capacity: '6',
                make: 'Fast charger 2',
                model: 'port 2',
                price: 0.25,
                equipment: 'Electric vehicle supply equipment (EVSE )',
                status: 'ACTIVE',
                chargingVehicleId: this.generateId(10),
                organizationId: this.generateId(3)
            },
            {
                id: this.generateId(15),
                capacity: '4',
                make: 'Fast charger 1',
                model: 'port 2',
                price: 1,
                equipment: 'Electric vehicle supply equipment (EVSE )',
                status: 'ACTIVE',
                chargingVehicleId: this.generateId(11),
                organizationId: this.generateId(3)
            },
            {
                id: this.generateId(16),
                capacity: '4',
                make: 'Fast charger 1',
                model: 'port 3',
                price: 1,
                equipment: 'Electric vehicle supply equipment (EVSE )',
                status: 'ACTIVE',
                chargingVehicleId: this.generateId(11),
                organizationId: this.generateId(3)
            },
            {
                id: this.generateId(17),
                capacity: '4',
                make: 'Fast charger 3',
                model: 'port 1',
                price: 1,
                equipment: 'Electric vehicle supply equipment (EVSE )',
                status: 'ACTIVE',
                chargingVehicleId: this.generateId(8),
                organizationId: this.generateId(3)
            }] as ChargingTerminal[];
        this.setItems('chargingTerminal', chargingTerminals, false);
    }
}
