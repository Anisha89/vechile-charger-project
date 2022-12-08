import { Injectable, Inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { DOCUMENT } from "@angular/common";

@Injectable()
export class AppContext {
    currentLocation: any = {
        latitude: 40.748817,
        longitude: -73.985428,
        lat: 40.748817,
        lng: -73.985428,
        default: false
    };

    ASIDE_CONTEXT_CHARGING_VEHICLE = 'ChargingVehicle';


    private context: {
        [key: string]: any
    } = {};

    asideContext:{
        type?: string,
        object?: any
    } = {};

    private notification = new Subject<any>();

    registerForNotification(): Observable<any> {
        return this.notification.asObservable();
    }

    constructor(@Inject(DOCUMENT) private document: Document) {

    }

    notify(obj: any) {
        this.notification.next(obj);
    }


    getCurrentLocation(): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            if (!this.currentLocation.default) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        this.currentLocation.latitude = position.coords.latitude;
                        this.currentLocation.longitude = position.coords.longitude;
                        this.currentLocation.lat = position.coords.latitude;
                        this.currentLocation.lng = position.coords.longitude;
                        this.currentLocation.address = '';
                        resolve(this.currentLocation);
                      });
                }
            } else {
                resolve(this.currentLocation);
            }
        });

        return promise;
    }

    getNYLocation(): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            if (!this.currentLocation.default) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        this.currentLocation.latitude = 40.7127753;
                        this.currentLocation.longitude = -74.0059728;
                        this.currentLocation.lat = 40.7127753;
                        this.currentLocation.lng = -74.0059728;
                        this.currentLocation.address = 'New York, NY, USA';
                        resolve(this.currentLocation);
                      });
                }
            } else {
                resolve(this.currentLocation);
            }
        });

        return promise;
    }

    set(key: string, value: any) {
        this.context[key] = value;
    }

    get(key: string): any {
        return this.context[key];
    }

    remove(key: string): any {
        delete this.context[key];
    }

    clear(): any {
        return this.context = {};
    }

    getCopy(key: string): any {
        let value = this.get(key);
        if (value != null) {
            value = this.clone(value);
        }
        return value;
    }

    clone(obj: any) {
        if (obj != null && typeof obj === 'object') {
            obj = JSON.parse(JSON.stringify(obj));
        }
        return obj;
    }

    setAsideContext(type: string, object: any) {
        this.asideContext['type'] = type;
        this.asideContext['object'] = object;
        this.document.body.classList.add('aside-menu-lg-show');
        this.document.body.classList.add('aside-menu-show');
    }

    clearAsideContext() {
        this.asideContext = {};
        this.document.body.classList.remove('aside-menu-lg-show');
        this.document.body.classList.remove('aside-menu-show');
    }
}
