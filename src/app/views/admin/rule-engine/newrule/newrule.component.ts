import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Organization } from '../../../../models';
import { ValidationError, ValidationSpec } from '../../../../services/base.validator';
import { RuleModel, RuleModelDTO, alarmPriorities, NOTIFICATON_ALARM, NOTIFICATON_EMAIL, NOTIFICATON_SMS } from '../models/rule.model';
import { RuleEngineService } from '../rule-engine.service';
import { NewRuleValidator } from './newrule.validator';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Domain, DomainDataMgr } from '../../../../models/domain.model';
import { DomainService } from '../../../../services/domain-service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { User } from '../../../../models/user.model';
import { ArrayType } from '@angular/compiler';
import { RulePropertyModel, RulePropertyModelMgr } from '../models/rule.property.model';
import { Payload } from '../models/rule-builder.interace';
import { RuleAssetModel } from '../models/rule-asset-map.model';
import { RuleBuilderComponent } from '../rule-builder/rule-builder.component';
import { FormControl } from '@angular/forms';
import { RuleTester, TestResult } from '../rule-tester';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-newrule',
  templateUrl: './newrule.component.html',
  styleUrls: ['./newrule.component.scss'],

})
export class NewruleComponent implements OnInit {
  isLoading = false;
  changed: boolean;
  currentOrganization: Organization;
  rules: RuleModel[] = new Array<RuleModel>();
  showMsg:boolean=false;
  rule: RuleModel;
  add: boolean;
  alarm: any;
  selected: RuleModel = null;
  disabled: boolean;
  showList = true;
  validationErrors: { [key: string]: ValidationError };
  validationSpecs: { [key: string]: ValidationSpec } = {};
  @ViewChild('deleteConfirmationModal')
  public deleteConfirmationModal: ModalDirective;
  @ViewChild('statusChangeModal')
  public statusChangeModal: ModalDirective;
  @ViewChild('publishConfirmationModal')
  public publishConfirmationModal: ModalDirective;
  @ViewChild('discardConfirmationModal')
  public discardConfirmationModal: ModalDirective;
  @ViewChild('errorModal')
  public errorModal: ModalDirective;
  @ViewChild('successModal')
   public successModal : ModalDirective;
  @ViewChild('ruleHeader') ruleHeader: ElementRef<any>;
  @ViewChild('ruleBuilder') ruleBuilder: RuleBuilderComponent;
  public addressControl: FormControl = new FormControl();
  @ViewChild('addressRef')
  public addressElementRef: ElementRef;
  // Rule Engine Specific Starts
  @ViewChild('alarmValueDropdown') alarmValueDropdown: any;
  @ViewChild('alarmNameDropdown') alarmNameDropdown: any;
  dropdownSettingsAssetId: IDropdownSettings;
  dropdownSettingsAssetType: IDropdownSettings;
  domainIdAndNameList = Domain.domaintypeList;
  selectedDomainIdAndNameList: any[];
  alarmPriorities=alarmPriorities;
  domains: Domain[];
  startTime: string;
  endTime: string;
  timeRangeValue = [0, 24];
  checked: boolean;
  errors: any = {};
  tags: any[] = [];
  propColoralarm: string = 'grey'
  propColoremail: string = 'grey'
  propColorsms: string = 'grey'
  selectedDomains: Domain[];
  assetTypes: string[] = [];
  isSelected: boolean;
  domainMgr = new DomainDataMgr();
  newOrEdit: string = "New";
  pageSizeRules: number = 5;
  rulePropertyModelMgr = new RulePropertyModelMgr();
  rulesList = [];
  saveDisabled = true;
  payload: Payload = { name: 'realTime', assetTypes: {}, datapoints: [] } as Payload;
  assets: RuleAssetModel[] = [];
  applicableAssets: RuleAssetModel[] = [];
  objectKeys = Object.keys;
  datalistNeeded: boolean;
  alarmOutputValueOptions: any[];
   requestInProgress = false;
   ruleAlarmName: any[] = []; // For angular2-multiselect-dropdown
  ruleAlarmValue: any[] = [];
  filter: string;
   statuses = [1, 2, 3];
  statusesName = ['critical', 'maintenance', 'low'];
  timeZone: string;
  assetsSetting: any = {
    text: 'Select Assets',
    enableSearchFilter: true,
    searchBy: ['assetSerialNumber'],
    enableFilterSelectAll: false,
    labelKey: 'assetSerialNumber',
    primaryKey: 'assetSerialNumber'
  };
  testRule: RuleModel;
  assetStates: any[];
  testResults: TestResult[];
  showTestResult: boolean;

  constructor(private service: RuleEngineService,
    private context: AppContext,
    private validator: NewRuleValidator,
    private domainService: DomainService,
    protected ruleTester: RuleTester,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.rule = RuleModel.createEmptyRule();
    this.currentOrganization = this.context.get('current-organization');
    this.errors = {};
    this.initDropdownSettings();
    this.getAssets();
 }
  
  getAssets() {
    this.domainService.getAssetsBycompany(this.currentOrganization.id).subscribe(domPage => {
      let domLst = []
      for (let dom of domPage?.content) {
        domLst.push(DomainService.staticTransformtoDomainDto(dom))
      }
      this.domains = domLst;
      console.log(this.domains);
      this.domainMgr.init(domLst);
      this.selectedDomains = this.domainMgr.getAssetsByIds(this.rule.assetIds);
      this.selectedDomainIdAndNameList = this.rule.assetType;
      this.getRulePropertyAll();
    }
      , error => {
        this.isLoading = false;
        console.log(error);
      });
  }

  getRulePropertyAll() {
    this.service.getRulePropertyAll().subscribe(domPage => {
      this.rulePropertyModelMgr.init(domPage);
      // changes for showing value from rules to UI
      this.getRulesByCompany();
    }, error => {
      this.isLoading = false;
      // TODO display error
      console.log(error);
    });
  }

  getRulesByCompany() {
    this.isLoading = true;
    this.currentOrganization = this.context.get('current-organization');
    this.service.getRulesBycompany(this.currentOrganization.id).subscribe(domPage => {
      let domLst = [];
      for (let dom of domPage?.content) {
        const rule = RuleModel.toRuleModel(dom);
        rule.assets = this.domainMgr.getRuleAssetModelList(rule.assetIds);
        domLst.push(rule);
      }
      this.rules = domLst;
      // changes for showing value from rules to UI
      this.isLoading = false;
      if (this.rules.length > 0) {
        this.rule = this.rules[0];
        this.selected = this.rule;
        this.newOrEdit = "Edit";
      }
      this.selectedDomains = this.domainMgr.getAssetsByIds(this.rule.assetIds);
      this.selectedDomainIdAndNameList = Domain.getDomainTypesFromStringArray(this.rule.assetType);
      this.updateNotificationSelection();
      this.service.initializeRuleModel(this.rule);
      this.initTimeSlider();
      this.ruleBuilder.setRuleModel(this.rule); // app crashes here
      this.rule.rule = this.ruleBuilder.compileCodeAsString();
      this.initializeDataPoints();
      this.rulesList = this.rules;
    }, error => {
      this.isLoading = false;
      // TODO display error
      console.log(error);
    });
  }

  //Multiselet Functionality
  onItemSelect(item: any) {
    console.log('onItemSelct', item)
  }

  onSelectAll(items: any) {
    console.log('onSelectAll', items)
  }
  confirmAndChangeStatus(rule: RuleModel, $event: any) {
    this.select(rule, $event);
    rule.status = !rule.status;
    this.statusChangeModal.show();
  }

  onStatusChange(rule: RuleModel, $event: any) {
    this.statusChangeModal.hide();
    this.service.update(rule).subscribe(updatedRule => {

    });
  }


  onAdd($event: any) {
    this.newOrEdit = "New";
    this.rule = RuleModel.createEmptyRule();
    this.service.initializeRuleModel(this.rule);//rulebuiderui
    this.ruleBuilder.setRuleModel(this.rule);//edit rulebuiderui
    this.selectedDomains = [];
    this.selectedDomainIdAndNameList = [];
   
    this.initTimeSlider();
    this.updateNotificationSelection();
  }

  onEdit(rule: RuleModel, $event: any) {
    this.newOrEdit = "Edit";
    this.rule = rule;
    this.selectedDomains = this.domainMgr.getAssetsByIds(this.rule.assetIds);
  }

  cancelStatusChange(rule: RuleModel) {
    this.statusChangeModal.hide();
    rule.status = !rule.status;
  }

  confirmPublish(rule: RuleModel) {
    this.rule = rule;
    this.publishConfirmationModal.show();
  }

  publish(rule: RuleModel, $event?: any) {
    let login = this.context.get('logged-in-user') as User;
    this.publishConfirmationModal.hide();
    if (rule.published) {
      rule.published = false;
      rule.publishedBy = null;
      rule.publishedOn = null;
    } else {
      rule.published = true;
      rule.publishedBy = login.firstName;
      rule.publishedOn = new Date() ;
     
    }
    this.service.update(rule).subscribe(updatedRule => {
      console.log(updatedRule);
      return updatedRule;
    });
  }
  select(selected: RuleModel, $event?: any) {
    this.rule = selected;
    this.selected = selected;
    this.updateNotificationSelection();
    this.selectedDomains = this.domainMgr.getAssetsByIds(this.rule.assetIds);
    this.selectedDomainIdAndNameList = Domain.getDomainTypesFromStringArray(this.rule.assetType);
    this.service.initializeRuleModel(this.rule);
    this.ruleBuilder.setRuleModel(this.rule);
    this.rule.rule = this.ruleBuilder.compileCodeAsString();
    this.initTimeSlider();
  }

  updateNotificationSelection() {

    if (this.rule.isNotificationType(NOTIFICATON_ALARM)) {
      this.propColoralarm = ' #3EADCE';
    } else {
      this.propColoralarm = 'grey'
    }
    if (this.rule.isNotificationType(NOTIFICATON_EMAIL)) {
      this.propColoremail = ' #3EADCE';
    } else {
      this.propColoremail = 'grey'
    }
    if (this.rule.isNotificationType(NOTIFICATON_SMS)) {
      this.propColorsms = ' #3EADCE';
    } else {
      this.propColorsms = 'grey'
    }
  }
 onPutAlarm() {
    this.rule.toggleNotificationType(NOTIFICATON_ALARM);
    this.updateNotificationSelection();
  }
 onPutEmail() {
    this.rule.toggleNotificationType(NOTIFICATON_EMAIL);
    this.updateNotificationSelection();
 }
 onPutSms() {
    this.rule.toggleNotificationType(NOTIFICATON_SMS);
    this.updateNotificationSelection();
  }
 displayData(totalDatas) {
    this.rulesList = totalDatas;
  }

  initDropdownSettings() {
    this.dropdownSettingsAssetId = {
      singleSelection: false,
      idField: 'id',
      textField: 'entityName',
      selectAllText: 'SelectAll',
      unSelectAllText: 'UnSelectAll',
      itemsShowLimit: 5,
      allowSearchFilter: true
    }
    this.dropdownSettingsAssetType = {
      singleSelection: false,
      idField: 'domaintypeid',
      textField: 'name',
      selectAllText: 'SelectAll',
      unSelectAllText: 'UnSelectAll',
      itemsShowLimit: 5,
      allowSearchFilter: true
    }
  }
  markChange($event: any) {
    this.changed = true;
  }

  initTimeSlider() {
    this.timeRangeValue = [0, 24];
    if (this.rule.startTimeSchedule != null) {
      if (!(this.rule.startTimeSchedule instanceof Date)) {
        this.rule.startTimeSchedule = new Date(this.rule.startTimeSchedule);
      }
      this.timeRangeValue[0] = this.rule.startTimeSchedule.getHours();
    }
    if (this.rule.endTimeSchedule != null) {
      if (!(this.rule.endTimeSchedule instanceof Date)) {
        this.rule.endTimeSchedule = new Date(this.rule.endTimeSchedule);
      }
      this.timeRangeValue[1] = this.rule.endTimeSchedule.getHours() + 1;
    }
     this.formatTimeRange();
  }
 
  onTimeChange(timeRangeValue: number[]) {
    if (timeRangeValue && timeRangeValue.length === 2) {
      this.timeRangeValue = timeRangeValue;
      this.rule.startTimeSchedule.setHours(timeRangeValue[0]);
      this.rule.startTimeSchedule.setMinutes(0);
      this.rule.endTimeSchedule.setHours(timeRangeValue[1] - 1);
      this.rule.endTimeSchedule.setMinutes(59);
      this.rule.endTimeSchedule.setSeconds(59);
    }
    this.formatTimeRange();
  }

  formatTimeRange() {
    this.startTime = this.format(this.timeRangeValue[0], this.datePipe);
    this.endTime = this.format(this.timeRangeValue[1], this.datePipe);
  }

  format(hours: number, datePipe: DatePipe) {
    const date = new Date();
    date.setHours(hours);
    const hoursString = datePipe.transform(date, 'hh:00 a');
    return hoursString;
  }

  onDayScheduleChange(sceduledDayObjects: any[]) {
    this.rule.daySchedule = [];
    sceduledDayObjects.forEach(dayObject => {
      this.rule.daySchedule.push(dayObject['sort']);
    });
  }



  onSelectExcludeDay(excludeDayObjects: any[]) {
    this.rule.excludeDays = excludeDayObjects;
  }
 save($event: any) {
 
    this.tags=this.rule.tags;
    this._save($event);
    this.context.notify(null);
  }

  _save($event: any) {
    let login = this.context.get('logged-in-user') as User;
    const new_str = this.ruleBuilder.compileCodeAsString().slice();
    this.rule.updatedBy = login.firstName;
    this.rule.updatedOn = new Date();
    this.rule.assetIds = Domain.getDomainIds(this.selectedDomains);
    this.rule.assetType = Domain.getDomainTypeIds(this.selectedDomainIdAndNameList);
    this.rule.rawRuleString = this.ruleBuilder.rawCodeAsString();
    this.rule.compiledRule = new_str;
    this.rule.compiledRule2 = new_str;
  

    let service: Observable<any> = null;
    if (!this.rule.id) {
      this.rule.companyId = this.currentOrganization.id;
      this.rule.companyName = this.currentOrganization.name;
      service = this.create($event);
    } else {
      service = this.update($event);
      console.log("update called");
    }
  }

  callExternalAPI() {
    if (this.rule.localOrRemote) {
      // API will be provided by the client.
    }
  }

 
  create($event: any) {
    let localDto = this.rule;
    this.service.create(localDto).subscribe(response => {
      console.log(response);
     this.successModal.show();
     this.newOrEdit = "Edit";
     this.getRulesByCompany();
     this.callExternalAPI();
     return response;
    }
      , error => {
        // TODO display error
        this.errorModal.show();
        console.log(error);
      });
    return null;
    
  }

  update($event: any) {
    let localDto = this.rule;
    this.service.update(localDto).subscribe(response => {
      console.log(response);
      this.successModal.show();
      //this.refresh();
      this.callExternalAPI();
      return response;
    }

      , error => {
        // TODO display error
        console.log(error);
        this.errorModal.show();
      });
    return null;
  }

  refresh() {
    this.getRulesByCompany();
  }

  confirmAnddelete(selected: RuleModel, $event?: any) {
    this.select(selected, $event);
    this.deleteConfirmationModal.show();
  }

  delete(selected: RuleModel, $event?: any) {
    this.deleteConfirmationModal.hide();
    this.service.delete(selected.id).subscribe(reponse => {
      this.context.notify(null);
      this.refresh(); 
      this.callExternalAPI();   
    });
  }
  checkAndClose($event: any) {
    if (this.changed) {
      this.discardConfirmationModal.show();
    } else {
      this.refresh();
    }
  }
 
  initializeValidationRules() {
    const validationSpecs = [
      { field: 'name', mandatory: true, fieldLabel: 'Name of the Rule' },

    ] as ValidationSpec[];
    this.validator.setValidationSpecs(validationSpecs);
    validationSpecs.forEach(validationSpec => {
      this.validationSpecs[validationSpec.field] = validationSpec;
    });
  }

  // Rule Engine Specific Starts

  initializeDataPoints() {
    this.saveDisabled = true;
    if (this.rule.assetType) {
      this.payload.assetTypeArray = this.rule.assetType;
    }
    //const datapoints = this.service._getAllDataPoints();
    const datapoints = this.rulePropertyModelMgr._getAllDataPoints();
    this.service.getAllDataPoints(datapoints).subscribe(payload => {
      this.payload = payload;
      if (this.rule.assetType == null) {
        this.rule.assetType = payload.assetType;
      } else {
        payload.assetType = this.rule.assetType;
      }
      this.saveDisabled = false;
    });
  }

  handleDatapointChanged($event: any) {  // need to understand this part.
  }

  test(rule: RuleModel) {
    this.isLoading = true;
    console.log(rule);
    this.testRule = rule;
    this.testRule.testInProgress = true;
    this.getAssetsStates(rule);
  }

  getAssetsStates(rule: RuleModel) {
    this.assetStates = [];
    const excludeAssets = [];
    rule.assets.forEach(assetStateJson => {
      const assetStateObj = {
        assetSerialNumber: assetStateJson.assetSerialNumber,
        state: this.rulePropertyModelMgr._getAllDataPoints()
      };
      this.assetStates.push(assetStateObj);
      this.ruleTester.testRule(rule, this.assetStates, excludeAssets)
        .subscribe((testResults: TestResult[]) => {
          this.testResults = testResults;
          this.testRule.testInProgress = false;
          this.afterTest();
          this.isLoading = false;
        }, error => {
          this.isLoading = false;
          // TODO display error
          console.log(error);
        });
    });
  }

  afterTest() {
    this.showTestResult = true;
  }

  onTestResultModalClose() {
    this.showTestResult = false;
  }
}


