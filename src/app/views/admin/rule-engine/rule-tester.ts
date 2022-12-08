import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RuleModel } from './models/rule.model';
import { RuleAssetModel } from './models/rule-asset-map.model';
import { UnitConversionFormulaService } from './unit-conversion-formula.service';

export interface TestResult {
    assetSerialNumber: string;
    datapoints?: Datapoint[];
    result: string;
    error: string;
}

export interface Datapoint {
    name: string;
    value: any;
    unit?: string;
}
/**
 * All the required validation for the rule model
 */
@Injectable()
export class RuleTester {
    testContext: any = {};
    assetStates: any[];
    testResults: TestResult[];

    constructor(private unitConversionFormulaService: UnitConversionFormulaService) {}


    testRule(rule: RuleModel, assetStates: any[], excludeAssets: string[]): Observable<TestResult[]> {
        const observable: Observable<TestResult[]> = new Observable(observer => {
           this.testResults = [];
           this.assetStates = assetStates;
           this.assetStates = assetStates;
           for (const asset of rule.assets) {
               if (excludeAssets.indexOf(asset.assetSerialNumber) >= 0) {
                const result = {
                    assetSerialNumber: asset.assetSerialNumber,
                    result: null,
                    error: 'ERROR: Can\'t evaluate Rule, Asset data not found'
                };
                this.testResults.push(result);
               } else {
                    const testResult = this.testRuleForAsset(rule, asset);
                    this.testResults.push(testResult);
               }
           }
           observer.next(this.testResults);
        });
        return observable;
    }

    testRuleForAsset(rule: RuleModel, asset: RuleAssetModel) {
        this.testContext = {};
        let error: string;
        const errors = [];
        const datapoints = [];
        let hasError = false;
        const ruleJSON = JSON.parse(rule.rule);
        let ruleCode = ruleJSON.code;
        ruleCode = this.replaceFunctions(ruleCode);
        /**
         *  Loop through all the meta attribute, take the datapoint value from asset state,
         *  If Datapoint is not found, set error and stop the process for given asset
         *  if value from coming state is null set the error and stop the process for given asset
         *  if Value is not null do followings -
         *   set it in the testContext object
         *   Convert datapoint and condition value in same unit
         *   replace rule code referring to testContext variable
         */

        for (const metaKey in ruleJSON.meta) {
            if (ruleJSON.meta[metaKey]) {
                const field = ruleJSON.meta[metaKey]['field'];
                const datapoint = this.getStateValueForAsset(field, asset.assetSerialNumber);
                if (datapoint) {
                    if (datapoint.value) {
                        for (const valueKey in ruleJSON.meta[metaKey]['values']) {
                            if (ruleJSON.meta[metaKey]['values'][valueKey]) {
                                const valname = ruleJSON.meta[metaKey]['values'][valueKey]['valname'];
                                const value = ruleJSON.meta[metaKey]['values'][valueKey]['value'];
                                // For different units
                                const ruleValueUnit = ruleJSON.meta[metaKey]['values'][valueKey]['unit'];
                                if (datapoint.unit !== ruleValueUnit) {
                                    datapoint.value = this.unitConversionFormulaService.convertUnitWithoutTargetUnit(datapoint.unit, datapoint.value);
                                }
                                this.testContext[valname] = value;
                                const replaceValue_value = 'this.testContext["' + valname + '"]';
                                ruleCode = this.replaceAll(ruleCode, valname, replaceValue_value);
                                // console.log('ruleCode after value replace -> ', ruleCode)
                            }
                        }
                        const varname = ruleJSON.meta[metaKey]['varname'];
                        this.testContext[varname] = datapoint.value
                        const datapointObj = {
                            name: datapoint.name,
                            value: datapoint.value,
                        }
                        datapoints.push(datapointObj);
                        const findMeta_key = varname + '(?![0-9_val])';
                        const replaceMeta_value = 'this.testContext["' + varname + '"]';
                        ruleCode = this.replaceAll(ruleCode, findMeta_key, replaceMeta_value);
                    } else {
                        hasError = true;
                        const datapointObj = {
                            name: datapoint.name,
                            value: 'null',
                        }
                        datapoints.push(datapointObj);
                        error = 'ERROR: Datapoint not found';
                    }

                } else {
                    hasError = true;
                    const datapointObj = {
                        name: field,
                        value: 'Not found',
                    }
                    datapoints.push(datapointObj);
                    error = 'ERROR: Datapoint not found';
                }



            }

        }
        let result;
        if (!hasError) {
            result = {
                assetSerialNumber: asset.assetSerialNumber,
                result: eval(ruleCode),
                datapoints: datapoints,
                error: ''
            }
        } else {
            result = {
                assetSerialNumber: asset.assetSerialNumber,
                datapoints: datapoints,
                result: null,
                error: error
            }
            // result.error = errors.join('<br/>');
        }
        return result;
    }

    replaceFunctions(code: string) {
        code = code.replace(/if[(]/g, 'this.iif(');
        code = code.replace(/contains[(]/g, 'this.contains(');
        code = code.replace(/like[(]/g, 'this.like(');
        return code;
    }

    getStateValueForAsset(datapoint: string, assetSerialNumber: string) {
        for (const assetState of this.assetStates) {
            if (assetState.assetSerialNumber === assetSerialNumber) {
                const foundDataPoint = this.findDataPoint(datapoint, assetState.state);
                return foundDataPoint;
            }
        }
    }

    findDataPoint(datapoint: string, datapoints: any[]) {
        let datapointToReturn = null;
        datapoints.forEach(assetDatapoint => {
            if (assetDatapoint['name'] === datapoint) {
                datapointToReturn = assetDatapoint;
            }
        });

        return datapointToReturn;
    }

    replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    iif(c: any, t: any, f: any) {
        return c === true ? t : f;
    }

    like(text: any, search: any) {
        return this.contains(text, search);
    }

    contains(text: string, search: string) {
        if (text) {
            return text.match(new RegExp(search, 'i')) != null;
        } else {
            return false;
        }
    }
}
