import { Component, OnInit, HostListener, ViewChild, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AgmMap, MapsAPILoader } from '@agm/core';
import { AppContext } from '../../app.context';
import { ChargingVehicle } from '../../models/charging-vehicle.model';
import { ChargingVehicleService } from '../admin/charging-vehicle/charging-vehicle.service';
import { ChargingTerminalService } from '../admin/charging-terminal/charging-terminal.service';
import { Organization } from '../../models';
// declare module 'googlemaps';
@Component({
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  @ViewChild(AgmMap)
  public map: AgmMap;

  public searchControl: FormControl;
  @ViewChild('originRef')
  public originElementRef: ElementRef;

  @ViewChild('destinationRef')
  public destinationElementRef: ElementRef;
  geoCoder: any = null;

  zoom = 13;
  height: number;
  currentLocation: any = {};
  origin: any = {
    address: ''
  };
  destination: any = {
    address: ''
  };
  direction = false;
  route = false;
  currentLocationBackup: any;
  chargingVehicles: any[] = [];
  filters: string[];

  currentOrganization: Organization;

  constructor(
      private context: AppContext,
      private mapsAPILoader: MapsAPILoader,
      private ngZone: NgZone,
      private chargingVehicleService: ChargingVehicleService,
      private chargingTerminalService: ChargingTerminalService) {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
      this.resize();
  }


  resize() {
      this.height = window.innerHeight - 26;
      if (document.getElementsByTagName('header').length > 0) {
          this.height -= document.getElementsByTagName('header').item(0).clientHeight;
      }
      if (document.getElementsByTagName('app-footer').length > 0) {
          this.height -= document.getElementsByTagName('app-footer').item(0).clientHeight;
      }

      if (document.getElementsByClassName('breadcrumb').length > 0) {
        this.height -= document.getElementsByClassName('breadcrumb').item(0).clientHeight;
    }
    this.map.triggerResize().then(() => {
      (this.map as any)._mapsWrapper.setCenter({lat: this.origin.latitude, lng: this.origin.longitude});
    });

  }

  ngOnInit() {
    this.currentOrganization = this.context.get('current-organization');
    this.resize();
    this.origin = this.context.currentLocation;
    this.searchControl = new FormControl();
    this.context.getCurrentLocation().then(currentLocation => {
      this.currentLocation = this.context.clone(currentLocation);
      this.origin = this.context.clone(currentLocation);
      this.initalizeSearch();
      this.currentLocationBackup = this.context.clone(currentLocation);

      this.map.triggerResize().then(() => {
        (this.map as any)._mapsWrapper.setCenter({lat: this.origin.latitude, lng: this.origin.longitude});
      });
    });
    this.loadChargingVehicles();
    this.loadFilterOptions();
  }

  clickedMarker(chargingVehicle: ChargingVehicle) {
    this.destination.address = chargingVehicle.address;
    this.destination.latitude = chargingVehicle.location.latitude;
    this.destination.longitude = chargingVehicle.location.longitude;
    this.destination.lat = chargingVehicle.location.latitude;
    this.destination.lng = chargingVehicle.location.longitude;
    this.destination = this.context.clone(this.destination);
    this.context.setAsideContext(this.context.ASIDE_CONTEXT_CHARGING_VEHICLE, chargingVehicle);
 }

 loadFilterOptions() {
  this.filters = ['Price', 'Distance'];
 }

  initalizeSearch() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      this.geoCoder.geocode({'location': this.origin}, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.origin.address = results[0].formatted_address;
          }
        }
      });
      const originAutocomplete = new google.maps.places.Autocomplete(this.originElementRef.nativeElement, {
      });
      originAutocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            // get the place result
            const place: google.maps.places.PlaceResult = originAutocomplete.getPlace();

            // verify result
            if (place.geometry === undefined || place.geometry === null) {
              this.origin = this.context.clone(this.currentLocationBackup);
              return;
            }
            // set latitude, longitude and zoom
            this.origin.latitude = place.geometry.location.lat();
            this.origin.longitude = place.geometry.location.lng();
            this.origin.lat = place.geometry.location.lat();
            this.origin.lng = place.geometry.location.lng();
            this.zoom = 12;
          });
      });

      const destinationAutocomplete = new google.maps.places.Autocomplete(this.destinationElementRef.nativeElement, {
      });
      destinationAutocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            // get the place result
            const place: google.maps.places.PlaceResult = destinationAutocomplete.getPlace();

            // verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            // set latitude, longitude and zoom
            this.destination.latitude = place.geometry.location.lat();
            this.destination.longitude = place.geometry.location.lng();
            this.destination.lat = place.geometry.location.lat();
            this.destination.lng = place.geometry.location.lng();
            this.zoom = 12;
            this.getRoute();
          });
      });
    });
  }

  loadChargingVehicles() {
    // TODO Get by Organization ID
    this.chargingVehicles = [];
    this.chargingVehicleService.getByOrganization(this.currentOrganization.id).subscribe(chargingVehicles => {
      chargingVehicles.forEach(chargingVehicle => {
        chargingVehicle = this.context.clone(chargingVehicle);
        this.chargingVehicles.push(chargingVehicle);
        this.chargingTerminalService.getByChargingVehicleId(chargingVehicle.id).subscribe(chargingTerminals => {
          let lowestPrice = -1;
          chargingTerminals.forEach(chargingTerminal => {
            if (lowestPrice === -1 || lowestPrice > chargingTerminal.price) {
              lowestPrice = chargingTerminal.price;
            }
          });
          if (lowestPrice === -1) {
            lowestPrice = 0;
          }
          chargingVehicle.price = lowestPrice;
          if (lowestPrice <= 2) {
            chargingVehicle.markerIconUrl = './assets/img/markers/EVCStation-Green.svg';
            // 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
          } else if (lowestPrice <= 3) {
            chargingVehicle.markerIconUrl = './assets/img/markers/EVCStation-Blue.svg';
            // 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
          } else {
            chargingVehicle.markerIconUrl = './assets/img/markers/EVCStation-Red.svg';
            // 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
          }
        });
      });
    });
  }

  selectDestination($event: any) {
    if (this.direction) {
      this.destination.latitude = $event.coords.lat;
      this.destination.lat = $event.coords.lat;
      this.destination.longitude = $event.coords.lng;
      this.destination.lng = $event.coords.lng;
      this.getRoute();
    }
  }

  getRoute() {
    this.geoCoder.geocode({'location': this.destination}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.destination.address = results[0].formatted_address;
          this.destination = this.context.clone(this.destination);
          this.showRoute();
        }
      }
    });
  }

  setDirectionMode(): void {
    this.direction = true;
  }

  unsetDirectionMode(): void {
    this.direction = false;
  }

  hideRoute(): void {
    this.unsetDirectionMode();
    this.route = false;
  }

  showRoute(): void {
    this.setDirectionMode();
    this.route = true;
    this.zoom = 12;
  }

  positionChanged($event: any) {
    console.log($event);
  }

  ngOnDestroy() {
    this.context.clearAsideContext();
  }

}
