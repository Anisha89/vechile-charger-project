import { GoogleMapsAPIWrapper } from '@agm/core';
import { Directive, Output, EventEmitter, OnInit } from '@angular/core';

declare var google: any;

@Directive({
  selector: 'app-location-marker'
})
export class AgmLocationMarkerDirective implements OnInit{
  marker: any;
  map: any;

  @Output('position-changed') change: EventEmitter<any> = new EventEmitter();

  constructor (private gmapsApi: GoogleMapsAPIWrapper) {}

  ngOnInit() {
    this.gmapsApi.getNativeMap().then(map => {
      if (!navigator.geolocation) {
        return;
      }

      this.map = map;
      navigator.geolocation.watchPosition(this.onPositionUpdate.bind(this), function(err) {
        console.log('Unable to get location:', err);
      }, {
        enableHighAccuracy: true,
        maximumAge: 1000
      });
    });
  }

  onPositionUpdate(position: any) {
    const pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    // Emit position change event
    this.change.emit(pos);

    if (this.marker) {
      // Update marker position
      this.marker.setPosition(pos);
      return;
    }

    // Marker needs to be created
    this.marker = new google.maps.Marker({
      map: this.map,
      position: pos
    });

    this.map.setCenter(this.marker.getPosition());
  }
}
