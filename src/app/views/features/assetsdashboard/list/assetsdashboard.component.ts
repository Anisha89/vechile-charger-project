import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AssetDashboardServiceNew } from '../assetdashboard.service';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationData, LocationDataMgr } from '../../../../models/locationdata.model';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ALL, Domain, DomainDataMgr } from '../../../../models/domain.model';
import { AssetService } from '../../../admin/asset/asset.service';
import { Organization } from '../../../../models/organization.model';
import { DomainService } from '../../../../services/domain-service';
import { RealtimeAssetMgr } from '../../../../models/realtimeasset.model';
import { FacilityService } from '../../../admin/facility/facility-service';
import { ThrowStmt } from '@angular/compiler';





@Component({
    selector: 'app-assetsdashboard',
    templateUrl: 'assetsdashboard.component.html',
    styleUrls: ['assetsdashboard.component.scss']
})

export class AssetsDashboardComponentNew implements OnInit {
    @ViewChild(GoogleMap, { static: false }) map: GoogleMap
    @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
    @ViewChild('mapSearchField') searchField: ElementRef;
    @ViewChild('mapfloatField') selectfloatField: ElementRef;
  
    currentOrganization: Organization;
    domainDataMgr = new DomainDataMgr();
    realtimeAssetMgr = new RealtimeAssetMgr();
    zoom = 12
    allasset:[];
    facilityIdData:[];
    private pInfoWindow: any;
    markerClustererImagePath =
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
    domainTypes=[];
    domainNameList : Array<String> =[ALL];
    isIndexedList : Array<String> =[ALL];
    isLoading=false;
    infoContent :String ="";
    infoAssetName :String =""; 

    // styles = {
    //   default: [],
    //   hide: [
    //     {
    //       featureType: "poi.business",
    //       stylers: [{ visibility: "off" }],
    //     },
    //     {
    //       featureType: "transit",
    //       elementType: "labels.icon",
    //       stylers: [{ visibility: "off" }],
    //     },
    //   ],
    // };

    center: google.maps.LatLngLiteral
    options: google.maps.MapOptions = {
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: true,
        mapTypeId: 'terrain',
        maxZoom: 18,
        minZoom: 8,
    }
    placeList = ["Chennai", "Bangalore"];
    facilities:[];
    locationDataMgr = new LocationDataMgr();
    constructor(
        private service: AssetDashboardServiceNew,
        private context: AppContext,
        private router: Router,
        private assetService:DomainService,
        private route: ActivatedRoute) {
    }

    
    
    ngOnInit() {
     
        this.currentOrganization = this.context.get('current-organization');
        this.domainTypes = Domain.getDomainTypes();
        this.getAssetListByCompnay();
        this.getFacilityDetail();
    }

    ngAfterViewInit() : void  {
      this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.selectfloatField.nativeElement,);
      const searchBox = new google.maps.places.SearchBox(this.searchField.nativeElement,);
     // this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.searchField.nativeElement,); // float the control in the top of the google map.
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length === 0 ) {
          return;
        }

        const bounds = new google.maps.LatLngBounds();
        places.forEach(place => {
          if (!place.geometry || !place.geometry.location) {
            return;
          }
          if (place.geometry.viewport){
            bounds.union(place.geometry.viewport);
          }
          else {
            bounds.extend(place.geometry.location);
          }
        });
        this.map.fitBounds(bounds);
      });
    }
   
    onSelectionChange() {
      this.getAssetListByCompnay();
    }

 
   
    getAssetListByCompnay() {
        this.isLoading=true;
        this.currentOrganization = this.context.get('current-organization');
        this.service.getAssetListByCompnay(this.currentOrganization.id).subscribe(domPage => {
            let domLst = []
            for(let dom of domPage?.content) {
              domLst.push(dom);
            }
            this.domainDataMgr.init(domLst);
            let nameList = this.domainDataMgr.getDomainNameList();
            let isIndexedList = this.domainDataMgr.getIsIndexedAttributes();
            if (nameList.length > 0) {
              this.domainNameList = this.domainNameList.concat(nameList);
            }
            if (isIndexedList.length > 0) {
              this.isIndexedList = this.isIndexedList.concat(isIndexedList);
            }
            this.isLoading=false;
           
            this.getAllRealTimeAssets(ALL);
        }, error => {
            this.isLoading=false;
            console.log(error);
        });
    }

    getAllRealTimeAssets(domainType:string) {
        let assetIdList = this.domainDataMgr.getAssetsByDomainType(domainType);
        this.getRealtimeAssetListByCompany(assetIdList);
    }
     
    getRealtimeAssetListByCompany(assetIdList : Array<String>) {
        this.isLoading=true;
        this.realtimeAssetMgr =  new RealtimeAssetMgr();
        this.locationDataMgr = new LocationDataMgr();
        this.service.getRealtimeAssetListByCompany(this.currentOrganization.id).subscribe(domPage => {
            let domLst = []
            for(let dom of domPage?.content) {
              let assetId :string = dom.assetId;
              if (assetIdList.indexOf(assetId) >= 0) {
                domLst.push(dom);
              }
            }
            if (domLst.length > 0) {
                this.realtimeAssetMgr.init(domLst);
                this.realtimeAssetMgr.applyIsIndexed(this.domainDataMgr.getIsIndexedAttributes());
                this.locationDataMgr.initLocationDataList(this.realtimeAssetMgr.getRealtimeAssetLocationList());
                this.locationDataMgr.createGMapMarkers(this.domainDataMgr);
                let bounds = this.locationDataMgr.getfitbounds();
                this.map.fitBounds(bounds);
               }

            this.isLoading=false;
        }, error => {
            this.isLoading=false;
            console.log(error);
        });
    }
   

   
    gmapMarkerClick(markerElem: MapMarker, marker: MapMarker, content) {
      let assetId = marker.title;
      let locationData: LocationData = this.locationDataMgr.getLocationDataByTitle(assetId);
      if (locationData) {
          let realTimeAsset = this.realtimeAssetMgr.getRealTimeAsset(assetId);
          let fixedAsset = this.domainDataMgr.getAssetById(assetId);
          let isIndexedList = this.isIndexedList;
          this.context.set('selected-location', locationData);
          this.context.set('selected-marker', marker);
          this.context.set('real-time-asset', realTimeAsset);
          this.context.set('fixed-asset', fixedAsset);
          this.context.set('is-indexed-list', isIndexedList);
          
          let rtasHtml = realTimeAsset.getIsIndexAttributesAsHtmlTable();
          this.infoContent = this.getInfoContent(rtasHtml, fixedAsset.entityName);
          this.infoAssetName = fixedAsset.entityName;
          this.infoWindow.open(markerElem);
      }
    }

    getInfoContent(rtasHtml : String, assetName: String) {
      let contentString = 
        
          rtasHtml 
     
      return contentString;
    }
 
  
    zoomIn() {
        if (this.zoom < this.options.maxZoom) this.zoom++
    }
    
    zoomOut() {
      if (this.zoom > this.options.minZoom) this.zoom--
    }

    addMarker() {
      //this.markers.push(this.createMarker("loc: " + (this.markers.length+1).toString(), this.center.lat + ((Math.random() - 0.5) * 2) / 10, this.center.lng + ((Math.random() - 0.5) * 2) / 10));
    }

    logCenter() {
      console.log(JSON.stringify(this.map.getCenter()))
    }

    link(){
      this.router.navigate(['features/assetdashboard/view']);
    
    } 
    getFacilityDetail(){
      this.assetService.getFacilityByOrganization(this.currentOrganization.name).subscribe(data => {
       this.facilities=data.content;
       this.isLoading=false;
    }, error => {
        this.isLoading=false;
         console.log(error);
    });
    } 

    onFacilityChange(faciltyId:string){
      console.log(faciltyId);
    
     
     
    }

    onDomainTypeChange(domainType:string) {
     this.getAllRealTimeAssets(domainType);
    }

    onDomainNameChange(assetName:string) {
      if (assetName === ALL) {
        this.onDomainTypeChange(ALL);
      }
      else {
        let assetIdList = this.domainDataMgr.getAssetIdsByName(assetName);
      this.getRealtimeAssetListByCompany(assetIdList);
      }
      
    }

    onIsIndexedChange(attributeName:string) {
      if (attributeName === ALL) {
        this.onDomainTypeChange(ALL);
      }
      else {
        let assetIdList = this.domainDataMgr.getAssetsByIsIndexed(attributeName);
        this.getRealtimeAssetListByCompany(assetIdList);
      }
    }
  }
