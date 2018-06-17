import Required from "./Rules/Required";
import Email    from "./Rules/Email";
import Url      from "./Rules/Url";
import Phone    from "./Rules/Phone";
import Min      from "./Rules/Min";
import Max      from "./Rules/Max";

export default class Validator {

    constructor(form = {}, ruleSet = {}) {
        this.form = form;
        this.ruleSet = ruleSet;
        this.currentfield = '';
        this.parentfields = [];
        this.errors = {};
        this.ruleObjects = {
            url     : Url,
            email   : Email,
            required: Required,
            phone   : Phone,
            min     : Min,
            max     : Max,
        }
    }

    validate() {
        this.setErrorsInRuleSet(this.ruleSet);

        return this.errors;
    }

    setErrorsInRuleSet(ruleSet) {
        for(this.currentfield in ruleSet) {
            let errors = this.getErrorsInCurrentField(ruleSet);
            this.setErrors(errors);
        }
        this.parentfields.pop();
    }

    getErrorsInCurrentField(ruleSet) {
        if(this.isParentField(ruleSet)) {
            this.validateChildRuleSet(ruleSet);
        }

        return this.runValidationsAndGetErrors(ruleSet);
    }

    runValidationsAndGetErrors(ruleSet) {
        let errors = [];

        for(let ruleObjectKeyIndex in this.getFieldRules(ruleSet)) {
            let error = this.callValidationMethod(ruleObjectKeyIndex, ruleSet);
            if(error !== undefined) {
                errors.push(error);
            }
        }

        return errors;
    }

    validateChildRuleSet(ruleSet) {
        this.parentfields.push(this.currentfield);
        this.setErrorsInRuleSet(ruleSet[this.currentfield]);
    }

    validateField(fieldName) {
        let errors;
        this.currentfield = fieldName;
        let ruleSet = this.getNestedRuleSet(fieldName);

        errors = this.getErrorsInCurrentField(ruleSet);

        this.setErrors(errors);
        if(errors.length < 1) {
            this.removeErrorFromCurrentField();
        }

        return errors;
    }

    getNestedRuleSet(fieldName) {
        let ruleSet = this.ruleSet;

        if(fieldName.indexOf('.')) {
            let fieldNames = fieldName.split('.');

            for(let i = 0; i < fieldNames.length - 1; i++) {
                this.parentfields.push(fieldNames[i]);

                ruleSet = ruleSet[fieldNames[i]];
                this.currentfield = fieldNames[i + 1];
            }
        }

        return ruleSet;
    }

    removeErrorFromCurrentField() {
        let errors = this.errors;
        for(let i in this.parentfields) {
            errors = errors[this.parentfields[i]];
        }

        if(errors === undefined) {
            return;
        }

        errors[this.currentfield] = [];
    }

    getError(field) {
        if(!this.fails()) {
            return;
        }

        let error = this.getNestedError(field);

        return error ? error[0] : null;
    }

    getNestedError(field) {
        let errors = this.errors;

        if(field.indexOf('.')) {
            let fields = field.split('.');
            for(let i in fields) {
                errors = errors[fields[i]];
            }
            return errors;
        }
        else {
            return errors[field];
        }
    }

    setErrors(errors) {
        if(this.errorsAreSet(errors)) {
            if(this.hasParentField()) {
                this.setErrorsWithParent(errors);
            }
            else {
                this.errors[this.currentfield] = errors;
            }
        }
    }

    setErrorsWithParent(newErrors) {
        let errors = this.errors;

        for(let i in this.parentfields) {
            let parent = this.parentfields[i];
            if(!errors[parent]) {
                errors[parent] = {};
            }
            errors = errors[parent];
        }
        errors[this.currentfield] = newErrors;
    }

    getFieldValue(fieldName) {
        if(this.hasParentField()) {
            return this.getChildFieldValue(fieldName);
        }

        return this.form[fieldName];
    }

    getChildFieldValue(fieldName) {
        let form = this.form;
        for(let parent in this.parentfields) {
            form = form[this.parentfields[parent]];
        }

        return form[fieldName];
    }

    getFieldRules(ruleSet) {
        return ruleSet[this.currentfield];
    }

    callValidationMethod(ruleObjectKeyIndex, ruleSet) {
        let ruleObjectKey = this.getFieldRules(ruleSet)[ruleObjectKeyIndex];
        let rule = this.makeRuleFromKey(ruleObjectKey);

        return rule.validate();
    }

    makeRuleFromKey(key) {
        let options;
        if(key.indexOf(':')) {
            options = key.split(':');
            key = options.splice(0, 1)[0];
        }
        return new this.ruleObjects[key](this.currentfield, this.getFieldValue(this.currentfield), options)
    }

    hasParentField() {
        return this.parentfields.length > 0;
    }

    isParentField(ruleSet) {
        return !Array.isArray(ruleSet[this.currentfield]);
    }

    errorsAreSet(errors) {
        return errors !== undefined && errors.length > 0
    }

    fails() {
        return Object.keys(this.errors).length > 0;
    }

}
