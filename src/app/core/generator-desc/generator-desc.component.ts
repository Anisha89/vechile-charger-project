import * as jQuery from 'jquery';
import { Generator } from '../../app-common';
import { Component, OnInit,Input, SimpleChanges, Output, EventEmitter } from '@angular/core';

import * as _ from 'underscore';

@Component({
  selector: 'app-generator-desc',
  templateUrl: './generator-desc.component.html',
  styleUrls: ['./generator-desc.component.scss']
})
export class GeneratorDescComponent implements OnInit {



  @Output() assetChanged: EventEmitter<any> = new EventEmitter();

  public assetDescInfo: any;

  defaultImg: string;
  public movablePx = 15;
  public selectedIndex = 0;
  @Input() assetsAvailable: Generator[] = [];
  public assetId: any = null;
  public devices = [];

  constructor() {
    this.defaultImg = 'assets/images/default_asset.svg#def_asset';
  }

  ngOnInit() {
    // this.getGenAvailable();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getGenAvailable();
  }
  getGenAvailable(){
    if (!this.assetId) {
      this.selectedIndex = 0;
      if (this.assetsAvailable[0]) {
        this.assetId = this.assetsAvailable[0].assetId;
      }
    } else {
      this.selectedIndex = _.indexOf(this.assetsAvailable, _.findWhere(this.assetsAvailable, { 'assetId': this.assetId }));
    }
    this.devices = this.assetsAvailable;
    if(this.devices && this.devices.length > 0){
      this.getAssetSelected();
    }

  }
  ngAfterViewInit() {
    const that = this;
    document.getElementById('genAssetsSelect').addEventListener('change', function () {
      that.getGenAvailable();
    });

  }




  getAssetSelected() {
    this.setUnitToAssetsAvailable();
    this.assetDescInfo = this.assetsAvailable ? this.assetsAvailable[this.selectedIndex] : null;
    if (this.assetDescInfo) {
      this.isAssetDescInfoAvailable();
    }
    this.assetChanged.emit(this.assetsAvailable[this.selectedIndex]);
  }

  isAssetDescInfoAvailable() {
    if (this.assetDescInfo && !this.assetDescInfo['assetType'] && !this.assetDescInfo['vin'] && !this.assetDescInfo['serialNumber'] && !this.assetDescInfo['unitNumber'] && !this.assetDescInfo['calibrationId']) {
      this.assetDescInfo.isRequiredFiledAvailable = false;
    } else {
      this.assetDescInfo.isRequiredFiledAvailable = true;
    }
  }


  setUnitToAssetsAvailable() {
    this.assetsAvailable.forEach(asset => {
      this.devices.forEach(device => {
        if (device.assetId === asset.assetId) {
          asset['param'] = device.param;
        }
      });
    });
  }

  showArrow(id) {
    if (jQuery('#' + id + ' .arrows').hasClass('active-arrow')) {
      jQuery('#' + id + ' .arrows').removeClass('active-arrow');
    } else {
      jQuery('.arrows').removeClass('active-arrow');
      jQuery('#' + id + ' .arrows').addClass('active-arrow');
    }
  }

  leftClick(event, id) {
    event.stopPropagation();
    let movableDiv = document.getElementById(id);
    let left = parseInt(movableDiv.style.left, 10);
    if (!left) {
      movableDiv.style.left = this.movablePx + 'px';
    } else {
      movableDiv.style.left = left + this.movablePx + 'px';
    }
  }

  rightClick(event, id) {
    event.stopPropagation();
    let movableDiv = document.getElementById(id);
    let left = parseInt(movableDiv.style.left, 10);
    if (!left) {
      movableDiv.style.left = -this.movablePx + 'px';
    } else {
      movableDiv.style.left = left - this.movablePx + 'px';
    }
  }
}
