import { Component, OnInit, ViewChild} from '@angular/core';
import { AssetService } from '../asset.service';
import { AppContext } from '../../../../app.context';
import { Domain, IdAndName, DomainAttribute } from '../../../../models/domain.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { AssetValidator } from './asset.validator';
import { ValidationError, ValidationSpec } from '../../../../services/base.validator';
import { JSONHelper } from '../../../../services/jsonhelper';

@Component({
    selector: 'app-asset',
    templateUrl: 'asset.component.html',
    styleUrls: ['asset.component.scss']
})

export class AssetComponent implements OnInit {
    domaintypeid: string;
    jsonData: any;
    fileName: any;
    domainIdAndNameList = Domain.domaintypeList;
    domain: Domain = {} as Domain;
    changed: boolean;
    idAndNames: IdAndName[] = new Array<IdAndName>();
    validationErrors: { [key: string]: ValidationError };
    validationSpecs: { [key: string]: ValidationSpec } = {};

    @ViewChild('discardConfirmationModal')
    public discardConfirmationModal: ModalDirective;
    @ViewChild('errorModal')
    public errorModal: ModalDirective;
    isLoading = false;
    domainAttributesArray = new Array<DomainAttribute>();
    constructor(
        private service: AssetService,
        private validator: AssetValidator,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {
    }
    ngOnInit() {
        this.isLoading = true;
        const domain = this.context.getCopy('selected-domain');
        const tParentDomains = this.context.getCopy('parent-domains');
        if (domain === null) {
             this.gotoListing();
             return;
         }
        this.domain = domain;
        if (this.domain.domainType === null || this.domain.domainType === undefined) {
            this.domain.domainType = "ASSET";
        }
        if (tParentDomains) {
            this.idAndNames = tParentDomains;
        }
        if (this.domain.domainAttributes) {
            this.domainAttributesArray = this.domain.domainAttributes;
        }
        this.initializeValidationRules();
        this.isLoading = false;
    }

    gotoListing() {
        this.router.navigate(['../list'], { relativeTo: this.route });
    }

    uploadLogo($event: any) {
        this.extractbase64Data($event).then(base64Data => {
            this.domain.rawFile = base64Data;
            this.domain.rawFileContentType = "image/png";
            this.markChange($event);
        });
    }

    uploadJson($event: any) {
        this.fileName = "";
        this.extractJsonData($event).then(jsonString => {
            console.log('jsonData = ' + jsonString);

            if (true === JSONHelper.validateJsonArray(jsonString)) {
                this.fileName = "Domain attributes loaded successfully / " + this.fileName;
                let domainAttributes = new Array<any>();
                this.domain.schemaDefinition = btoa(jsonString);
                JSON.parse(jsonString).forEach(jsonOject => {
                    domainAttributes.push(jsonOject);
                });
                let dattributes = Domain.createDomainAttributes(domainAttributes);
                this.domain.domainAttributes = dattributes;
                this.domainAttributesArray = this.domain.domainAttributes;
            }
            else {
                this.fileName = "Validation failed to load domain attributes / " + this.fileName;
            }
            this.domain.schemaDefinitionContentType = "application/json";
            this.markChange($event);
        });
    }

    extractJsonData($event: any): Promise<string> {
        const promise = new Promise<string>((resolve, reject) => {
            if ($event.target.files.length > 0) {
                const file: File = $event.target.files[0];
                this.fileName = file.name;
                const reader: FileReader = new FileReader();
                reader.onloadend = (e) => {
                    const jsonData = reader.result.toString();
                    resolve(jsonData);
                };
                reader.readAsText(file);

            } else {
                resolve(null);
            }
        });
        return promise;
    }

    extractbase64Data($event: any) {
        const promise = new Promise<string>((resolve, reject) => {
            if ($event.target.files.length > 0) {
                const file: File = $event.target.files[0];
                const reader: FileReader = new FileReader();
                reader.onloadend = (e) => {
                    const base64Data = reader.result.toString();
                    resolve(base64Data);
                    console.log(base64Data);

                };
                reader.readAsDataURL(file);
            } else {
                resolve(null);
            }
        });

        return promise;
    }

    markChange($event: any) {
        this.changed = true;
    }

    close($event?: any) {
        this.gotoListing();
    }

    save($event: any) {

        // NO ERROR
        this._save($event);
        this.context.notify(null);
        /*
       this.validator.validate(this.domain).then(validationErrors => {
           this.validationErrors = validationErrors;
           if (validationErrors == null) {
               // NO ERROR
               this._save($event);
               this.context.notify(null);
               
           }
       });*/
    }

    _save($event: any) {
        let service: Observable<any> = null;
        if (this.domain.id == null) {
            service = this.create($event);
        } else {
            service = this.update($event);
        }

        service.subscribe(domain => {
            this.changed = false;
            this.close($event);
        },
            error => {
                this.errorModal.show();
            },
            () => {
                // 'onCompleted' callback.
                // No errors, route to new page here
            }
        );
    }

    create($event: any) {
        console.log(this.domain)
        return this.service.create(this.domain);
    }

    update($event: any) {
        return this.service.update(this.domain);
    }

    checkAndClose($event: any) {
        if (this.changed) {
            this.discardConfirmationModal.show();
        } else {
            this.close($event);
        }
    }

    initializeValidationRules() {
        const validationSpecs = [
            { field: 'entityName', mandatory: true, fieldLabel: 'Entity Name of the Asset' },
            { field: 'description', mandatory: false, fieldLabel: 'Entity Description of Asset' },
            { field: 'owner', mandatory: false, fieldLabel: 'Owner of Asset' },
            { field: 'rawFile', mandatory: false, fieldLabel: 'Logo of Asset' },
            { field: 'domainTypes', mandatory: false, fieldLabel: 'Domain typeof Asset' },
            //  { field: 'parentDomain', mandatory: false, fieldLabel: ' Parent Domain of Asset' },//childdomains
            //  { field: 'schemaDefinition', mandatory: false, fieldLabel: 'schemaDefinition of Asset' },
        ] as ValidationSpec[];
        this.validator.setValidationSpecs(validationSpecs);
        validationSpecs.forEach(validationSpec => {
            this.validationSpecs[validationSpec.field] = validationSpec;
        })
    };
    statusChange(data, event) {
        this.domain.isActive = !this.domain.isActive;
    }
}
