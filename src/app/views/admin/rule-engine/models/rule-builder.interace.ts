import { RuleSet } from '../rule-builder/query-builder';

export interface Payload {
    name: string;
    assetType: string;
    assetTypes: {[key: string]: Datapoint[]};
    datapoints: Datapoint[];
    assetTypeArray: string[];
    datapointsMap: {[key: string]: Datapoint};
}

export interface Datapoint {
    name: string;
    type?: string;
    unit?: string;
    possibleUnits?: string[];
    applicableAssets?: string[];
}

export interface CompiledCode {
    meta: VariableMetaMap;
    code: string;
}

export interface VariableMeta {
    varname: string;
    type: string;
    field: string;
    values: ValueMetaMap;
}

export interface ValueMeta {
    valname: string;
    value: any;
    operator: string;
    unit?: string;
    threshold?: number;
    threaholdVarname?: string; // TODO Do we really need this?
    alarmStateThreshold: any;
    normalStateThreshold: any;
}

export interface VariableMetaMap {
    [key: string]: VariableMeta;
}

export interface ValueMetaMap {
    [key: string]: ValueMeta;
}

export interface RawRule {
    ruleSet: RuleSet;
    datapoints: {[key: string]: number};
}
