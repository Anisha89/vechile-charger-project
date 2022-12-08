import * as Ajv from 'ajv';

const   schemaTesting = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    age: {
      type: 'integer',
    },
    amount: {
      type: 'number',
    },
    sex: {
      type: 'string',
      enum: ['male', 'female', 'transgender'],
    },
    married: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
  errorMessage: 'No additional properties',
  required: ['name', 'age', 'amount', 'sex', 'married'],
};

const schemaDomainAttribute  = {
  type: 'object',
  properties: {
    attributeName: {
      type: 'string',
    },
    attributeType: {
      type: 'string',
      enum: ['ASCII', 'COUNTER', 'DOUBLE','INET','INT','MAP','TIMESTAMP','UID','VARCHAR'],
    },
    attributeLength: {
      type: 'number',
    },
    attributeDescription: {
      type: 'string',
    },
    allowNull: {
      type: 'number',
    },
    isUnique: {
      type: 'number',
    },
    isIndexed: {
      type: 'number',
    },
    isForeignKey: {
      type: 'number',
    },
    min: {
      type: 'string',
    },
    max: {
      type: 'string',
    },
    threshold: {
      type: 'string',
    },
    domainId: {
      type: 'number',
    },
  },
  additionalProperties: false,
  errorMessage: 'No additional properties',
  required: ['attributeName', 'attributeType', 'allowNull', 'isUnique', 'isIndexed', 'isForeignKey'],
};

const schemaDomainAttributeArray  = {

    "items": {
        "required": [
            "attributeName",
            "attributeType",
            "attributeLength",
            "attributeDescription",
            "allowNull",
            "isUnique",
            "isIndexed",
            "isForeignKey",
            "min",
            "max",
            "threshold",  
            "domainId"
        ],
        "properties": {
            "": {
                "$id": "#/items/properties/attribute_name",
                "type": "string"
            },
            "attributeType": {
                "$id": "#/items/properties/attributeType",
                "type": "string",
                "enum":['ASCII', 'COUNTER', 'DOUBLE','INET','INT','MAP','TIMESTAMP','UID','VARCHAR']
            },
            "attributeLength": {
                "$id": "#/items/properties/attributeLength",
                "type": "integer"
            },
            "attributeDescription": {
                "$id": "#/items/properties/attributeDescription",
                "type": "string"
            },
            "allowNull": {
                "$id": "#/items/properties/allowNull",
                "type": "integer"
            },
            "isUnique": {
                "$id": "#/items/properties/isUnique",
                "type": "integer"
            },
            "isIndexed": {
                "$id": "#/items/properties/isIndexed",
                "type": "integer"
            },
            "isForeignKey": {
                "$id": "#/items/properties/isForeignKey",
                "type": "integer"
            },
            "min": {
              "$id": "#/items/properties/min",
              "type": "string"
            },
            "max": {
              "$id": "#/items/properties/max",
              "type": "string"
            },
            "threshold": {
              "$id": "#/items/properties/threshold",
              "type": "string"
            },
            "domainId": {
                "$id": "#/items/properties/domainId",
                "type": "integer"
            }
        },
        "$id": "#/items",
        "type": "object"
    },
    "$id": "http://example.org/root.json#",
    "type": "array",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#"
};

export class JSONHelper {
  static validateJson(pData:any) {
      var ajv = new Ajv();
      let jsonSchema = JSON.stringify(schemaDomainAttribute);
      const validate = ajv.compile(schemaDomainAttribute);
      const valid = validate(JSON.parse(pData));
      const errorLog = validate.errors;
      if (!valid) {
          console.log('JSONHelper Error: '+ errorLog);
      }
      console.log(valid)
      return valid;
    }
    static validateJsonArray(pData:any) {
      var ajv = new Ajv();
      let jsonSchema = JSON.stringify(schemaDomainAttributeArray);
      const validate = ajv.compile(schemaDomainAttributeArray);
      const valid = validate(JSON.parse(pData));
      const errorLog = validate.errors;
      if (!valid) {
          console.log('JSONHelper Error: '+ errorLog);
      }
      console.log(valid)
      return valid;
    }
}