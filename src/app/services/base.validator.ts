
export class BaseValidator {

    validationSpecs: ValidationSpec[];
    setValidationSpecs(validationSpecs: ValidationSpec[]) {
        this.validationSpecs = validationSpecs;
    }

    validate(data: any): Promise<{[key: string]: ValidationError}> {
        const promise = new Promise<{[key: string]: ValidationError}>((resolve, reject) => {
            let validationErrors: {[key: string]: ValidationError} = null;
            this.validationSpecs.forEach(validationSpec => {
                const validationError = this._validate(validationSpec, data);
                if (validationError != null) {
                    if (validationErrors == null) {
                        validationErrors = {};
                    }
                    validationErrors[validationError.field] = validationError;
                }
            });
            resolve(validationErrors);
        });
        return promise;
    }

    _validate(validationSpec: ValidationSpec, data: any): ValidationError {
        let validationError: ValidationError = null;
        const value = this._getFieldValue(validationSpec, data);
        if (validationSpec.mandatory) {
            if (value == null || value.toString().trim() === '') {
                validationError = {
                    field: validationSpec.field,
                    errorMessage: (validationSpec.errorMessage)
                                    ? validationSpec.errorMessage
                                    : 'Please enter ' + validationSpec.fieldLabel + '. It is mandatory.'
                } as ValidationError;
            }
        }
        if (value != null && value.toString().trim() !== '') {
            if (validationSpec.email) {
                const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!re.test(value)) {
                    validationError = {
                        field: validationSpec.field,
                        errorMessage: (validationSpec.errorMessage)
                                        ? validationSpec.errorMessage
                                        : 'Please enter valid email address for ' + validationSpec.fieldLabel + '. It is invalid.'
                    } as ValidationError;
                }
            }

            if (validationSpec.phoneNumber) {
                const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
                if (!re.test(value)) {
                    validationError = {
                        field: validationSpec.field,
                        errorMessage: (validationSpec.errorMessage)
                                        ? validationSpec.errorMessage
                                        : 'Please enter valid phone number for ' + validationSpec.fieldLabel + '. It is invalid.'
                    } as ValidationError;
                }
            }
            
            //https://stackoverflow.com/questions/23483855/javascript-regex-to-validate-ipv4-and-ipv6-address-no-hostnames
            // 127.1.1.7
            // fe80::e027:d3c6:94ce:dbd2%9
            if (validationSpec.ip) {
                // IPv4、IPv6
                 const re = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/ig;
                if (!re.test(value)) {
                
                        validationError = {
                            field: validationSpec.field,
                            
                            errorMessage: (validationSpec.errorMessage)
                                            ? validationSpec.errorMessage
                                            : 'Please enter valid ip address (IPv4) for ' + validationSpec.fieldLabel + '. It is invalid. For example: fe80::e027:d3c6:94ce:dbd2%9 / 192.168.1.1 '
                         } as ValidationError;
                }
         }

            //https://www.geeksforgeeks.org/how-to-validate-mac-address-using-regular-expression/
            //For example, 01-23-45-67-89-AB is a valid MAC address.
            //For example, 0123.4567.89AB is a valid MAC address.

            if (validationSpec.mac) {
                const re = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$/;//g
                if (!re.test(value)) {
                    validationError = {
                        field: validationSpec.field,
                        errorMessage: (validationSpec.errorMessage)
                                        ? validationSpec.errorMessage
                                        : 'Please enter valid mac address for ' + validationSpec.fieldLabel + '. It is invalid. For example: 01-23-45-67-89-AB'
                    } as ValidationError;
                }
            }
          
            if (validationSpec.version) {
                const re = /^\d+(\.\d+){0,2}$/;
                if (!re.test(value)) {
                    validationError = {
                        field: validationSpec.field,
                        errorMessage: (validationSpec.errorMessage)
                                        ? validationSpec.errorMessage
                                        : 'Please enter valid version for ' + validationSpec.fieldLabel + '. It is invalid. For example: 1.2.3'
                    } as ValidationError;
                }
            }

        }
        return validationError;


      



        
    }



    _getFieldValue(validationSpec: ValidationSpec, data: any): any {
        const field = validationSpec.field;
        const fieldParts = field.split('.');
        let value = data;
        fieldParts.forEach(fieldpart => {
            value = value[fieldpart];
        });
        return value;
    }
}


export class ValidationSpec {
    field: string;
    fieldLabel: string;
    mandatory: boolean;
    email: boolean;

    
    phoneNumber: boolean;
    errorMessage: string;
    validate: any;
    
    // new validations
    ip:string;
    mac:string;
    version:string;
}


export class ValidationError {
    field: string;
    errorMessage: string;
}
