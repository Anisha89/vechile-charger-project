import {Component, OnInit, Input, SimpleChanges, ElementRef, OnChanges} from '@angular/core';
import { Generator } from '../../app-common';
import { Socket } from 'ng-socket-io';
import * as jQuery from 'jquery';
import * as _ from 'underscore';
declare let google: any;

@Component({
  selector: 'app-generator-location',
  templateUrl: './generator-location.component.html',
  styleUrls: ['./generator-location.component.scss']
})
export class GeneratorLocationComponent implements OnInit, OnChanges {

  @Input() assetMapInfo: any;
  @Input() selectedAsset: any;
  @Input() assetsAvailable: Generator[]=[];

  public lat = 51.678418;
  public lng = 7.809007;

  public icon: any;
  public zIndex: any;
  public assetLocationHeight = 0;
  public geoMapValues: any = [];
  public map: any;
  public mapZoom = 15;
  private asset: Generator;
  private logoType: string;
  public response: Generator[]=[];

  public assetLocationAddress = {
    'address0': null,
    'address1': null,
    'address2': null,
    'address3': null
  };
  public labelOptions = '';
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {

  }

  ngAfterViewInit(){

  }

  getAssetAvailable(val) {
    if (this.response && this.response.length > 0) {
      this.response = this.response ? this.response : [];
      this.asset = _.filter(this.response, function (data) {
        return data.assetId === val;
      });
      if (this.asset) {
        this.logoType = this.asset[0].assetType;
        // return true;
      }
    }
    this.icon = this.getIcon();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logoType = null;
    this.setMinHeightAssetLocation();
    if (changes.assetMapInfo && changes.assetMapInfo.currentValue) {
      if (changes.assetMapInfo.previousValue) {
        this.setGoogleMapMarker(changes);
      }
    }

    if (changes.selectedAsset && changes.selectedAsset.currentValue) {
      this.assetLocationHeight = 0;
      this.labelOptions = null;
      this.assetLocationAddress = {
        'address0': null,
        'address1': null,
        'address2': null,
        'address3': null
      };
    }
    if (changes.assetsAvailable && changes.assetsAvailable.currentValue) {
      this.response = this.assetsAvailable;
    }


  }

  setMapInfo(asset) {
    this.zIndex = Number(asset.event_param[0].status) === 1 ? 94 : 93;
    this.assetMapInfo = asset;
    this.icon = this.getIcon();
  }
  centerChange(latlng) {
    const position = new google.maps.LatLng(latlng.lat.toFixed(6), latlng.lng.toFixed(6));
    this.map.panTo(position);
    const mapObject = this.map;
  }

  mapRendered($event) {
    this.map = $event;
    const mapObject = this.map;
    setTimeout(function() {
      google.maps.event.trigger(mapObject, 'resize');
    }, 1000);

  }

  setMinHeightAssetLocation() {
    /*const that = this;
    if(window.innerWidth > 991){
      setTimeout(function () {
        that.assetLocationHeight = document.getElementById('genAssetDashboardRight').offsetHeight + 270 - document.getElementById('genAssetDescApp')
            .offsetHeight - 4;
      }, true);
    } else{
      setTimeout(function () {
        that.assetLocationHeight = document.getElementById('genAssetDashboardRight').offsetHeight + 170 - document.getElementById('genAssetDescApp')
            .offsetHeight - 4;
      }, true);
    }*/

  }

  checkStatusType(statusType) {
    if (statusType[1]) {
      if (parseInt(statusType[1]) === 1) {
        this.zIndex = 94;
      } else {
        this.zIndex = 91;
      }
    } else {
      if (statusType[0] === 'Moving') {
        this.zIndex = 93;
      } else if (statusType[0] === 'Idle') {
        this.zIndex = 92;
      } else if (statusType[0] === 'Inactive') {
        this.zIndex = 95;
      } else {
        this.zIndex = 91;
      }
    }
  }


  setGoogleMapMarker(changes) {
    this.assetMapInfo = changes.assetMapInfo.currentValue;
    this.assetMapInfo.latitude = this.assetMapInfo.latitude ? parseFloat(this.assetMapInfo.latitude) : null;
    this.assetMapInfo.longitude = this.assetMapInfo.longitude ? parseFloat(this.assetMapInfo.longitude) : null;
    this.labelOptions = this.assetMapInfo.assetID;
    this.getAssetAvailable(this.assetMapInfo.assetID);
    if (this.assetMapInfo.latitude) {
      this.geoMapValues = JSON.parse(this.assetMapInfo.event_param)[0]._val.split(',');
      let statusType = JSON.parse(this.assetMapInfo.event_param)[0].sts.split(',');
      this.checkStatusType(statusType);
      this.getLocationInfo(this.assetMapInfo.latitude, this.assetMapInfo.longitude);
      this.mapZoom = 15;
    } else {
      this.icon = null;
      this.assetMapInfo.latitude = 36.778259;
      this.assetMapInfo.longitude = -119.417931;
      this.mapZoom = 2;
    }
    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: this.assetMapInfo.latitude, lng: this.assetMapInfo.longitude });
    this.map.setCenter(bounds.getCenter());
  }

  getLocationInfo(latitude, longitude) {
    let geocoder = new google.maps.Geocoder;
    let latlng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
    const that = this;
    geocoder.geocode({ 'location': latlng }, function (results, status) {
      if (status == 'OK') {
        let assetLocationAddress = results[0].formatted_address.split(',');
        if (assetLocationAddress) {
          that.assetLocationAddress.address0 = assetLocationAddress[0].trim();
          that.assetLocationAddress.address1 = assetLocationAddress[1].trim();
          that.assetLocationAddress.address2 = assetLocationAddress[2].trim().split(' ')[0];
          that.assetLocationAddress.address3 = assetLocationAddress[3].trim();
        }
      }
    });
  }

  getIcon() {
    let imageName = 'assets/icons/assettype/semitrailer.svg';
    if (this.logoType) {
      imageName = 'assets/icons/assettype/' + this.logoType.toLocaleLowerCase().replace(new RegExp(' ', 'g'), '')
          .toLocaleLowerCase() + '.svg';
    }
    return new google.maps.MarkerImage(imageName,
      new google.maps.Size(75, 75),
      new google.maps.Point(0, 0),
      new google.maps.Point(17, 34),
      new google.maps.Size(36, 36));
  }

}
