import { faCar, faHome, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { DomainDataMgr, DomainType } from "./domain.model";

export class LocationData {
    lat: Number;
    lng: Number
    name: string;
    id:string;
    constructor(pId, pName, pLat, pLng) {
      this.id = pId,
      this.name = pName;
      this.lat = pLat;
      this.lng = pLng;
    }

    static createGMapMarker(locationData:LocationData) {
      var markerIcon = {
        url: "/assets/img/car.svg", // url
        scaledSize: new google.maps.Size(128, 128), // scaled size
      };
      let marker =
      {
        position: {
          lat: locationData.lat,
          lng: locationData.lng,
        },
        label: {
          color: 'pink',
          text: locationData.name,
        },
        title: locationData.name,
        options: { animation: google.maps.Animation.DROP, icon: markerIcon, color: 'purple' , infowindow:new google.maps.InfoWindow },
      };
      return marker;
    }

  static createGMapMarkerSvg(ddMgr:DomainDataMgr, locationData: LocationData) {
    let markerIcon = faMapPin;
    let fillColor = "#ff0000";
    let domain = ddMgr.getAssetById(locationData.id);

    switch (domain.domainType) {
      case DomainType.TRANSACTIONAL:
        fillColor = "#ff0000";
        break;
      case DomainType.ANALYTICAL:
        fillColor = "#ffff00";
        break;
      case DomainType.MASTERCONFIG:
        fillColor = "#00ff00";
        break;
      case DomainType.ASSET:
        fillColor = "#0000ff";
        break;
    }
   var myStyles = [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
    ];
    let marker =
    {
      position: {
        lat: locationData.lat,
        lng: locationData.lng,
      },
      // label: {
      //   color: 'red',
      //   text: locationData.name,
      // },
      title: locationData.name,
      info: '',
      options: {
        animation: google.maps.Animation.DROP, icon: {
          path: markerIcon.icon[4] as string,
          fillColor: fillColor,
          fillOpacity: 1,
          anchor: new google.maps.Point(
           markerIcon.icon[0] / 2, // width
           markerIcon.icon[1] // height
          ),
          strokeWeight: 1,
          strokeColor: "#ffffff",
          scale: 0.1,
        },
        styles: myStyles,
      },
    };
    return marker;
  }

    static createGMapMarkers(ddMgr:DomainDataMgr, locationDataList:LocationData[]) {
      let tList = locationDataList;
      let locationGMapMarkerList = new Array<any>();
      for(let i = 0; i < tList.length; i++) {
        //locationGMapMarkerList.push(LocationData.createGMapMarker(tList[i]));
        locationGMapMarkerList.push(LocationData.createGMapMarkerSvg(ddMgr, tList[i]));
       }
      return locationGMapMarkerList;
    }

  };
  

  

  export class LocationDataMgr {
    locationDataList = new Array<LocationData>();
    locationGMapMarkerList = new Array<any>();
    constructor() {

    }

    initLocationDataList(dataList: LocationData[]) {
      this.locationDataList = dataList;
    }

    addLocationData(data: LocationData) {
      this.locationDataList.push(data);
    }

    createGMapMarkers(ddMgr:DomainDataMgr) {
      this.locationGMapMarkerList = LocationData.createGMapMarkers(ddMgr,this.locationDataList);
    }

    getfitbounds() {
      let bounds = new google.maps.LatLngBounds();
      let gmapMarkers =  this.locationGMapMarkerList;
      for( let i =0; i < gmapMarkers.length; i++) {
        bounds.extend(gmapMarkers[i].position);
      }
      return bounds;
    }

    getGMapMarkerList() {
      return this.locationGMapMarkerList;
    }

    getLocationDataList() {
      return this.locationDataList;
    }

    getLocationDataByTitle(pPlace : String) {
      let tList = this.locationDataList;
      for(let i = 0; i < tList.length; i++) {
         if (tList[i].name === pPlace) {
           return tList[i];
         }
      }
      return null;
    }
  }


 