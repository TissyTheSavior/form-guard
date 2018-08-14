import Required from "./Required";
import Email    from "./Email";
import Url      from "./Url";
import Phone    from "./Phone";
import Min      from "./Min";
import Max      from "./Max";
import RuleSet  from "./RuleSet";

export default class Validator {

    constructor(form = {}, ruleSet = {}) {
        this.form         = form;
        this.errors       = {};
        this.ruleSet      = new RuleSet(ruleSet);
        this.currentfield = '';
        this.parentfields = [];
        this.setValidationRules();
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
        if(ruleSet.isParentField(this.currentfield)) {
            this.validateChildRuleSet(ruleSet);
        }

        return this.runValidationsAndGetErrors(ruleSet);
    }

    runValidationsAndGetErrors(ruleSet) {
        let errors = [];

        for(let ruleObjectKeyIndex in ruleSet.getRulesInField(this.currentfield)) {
            let error = this.callValidationMethod(ruleObjectKeyIndex, ruleSet);
            if(error !== undefined) {
                errors.push(error);
            }
        }

        return errors;
    }

    validateChildRuleSet(ruleSet) {
        this.parentfields.push(this.currentfield);
        this.setErrorsInRuleSet(ruleSet.getRulesInField(this.currentfield));
    }

    /**
     *
     * @param fieldName String
     * @returns {*}
     */
    validateField(fieldName) {
        let errors;
        this.currentfield = fieldName;
        let ruleSet = this.ruleSet;

        if(fieldName.indexOf('.')) {
            let fieldNames = fieldName.split('.');
            this.setCurrentFieldNested(fieldNames);
            this.setParentFields(fieldNames);
            ruleSet = ruleSet.getNestedRuleSet(fieldNames);
        }

        errors = this.getErrorsInCurrentField(ruleSet);

        this.setErrors(errors);
        if(errors.length < 1) {
            this.removeErrorFromCurrentField();
        }

        return errors;
    }

    setCurrentFieldNested(fieldNames) {
        this.currentfield = fieldNames[fieldNames.length - 1];
    }

    setParentFields(fieldNames) {
        for(let i = 0; i < fieldNames.length - 1; i++) {
            this.parentfields.push(fieldNames[i]);
        }
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
        return errors[field];
    }

    setErrors(errors) {
        if(!this.errorsAreSet(errors)) {
            return;
        }

        if(this.hasParentField()) {
            this.nestErrorsInParent(errors);
        }
        else {
            this.errors[this.currentfield] = errors;
        }

    }

    nestErrorsInParent(newErrors) {
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

    callValidationMethod(ruleObjectKeyIndex, ruleSet) {
        let ruleObjectKey = ruleSet.getRulesInField(this.currentfield)[ruleObjectKeyIndex];
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

    errorsAreSet(errors) {
        return errors !== undefined && errors.length > 0
    }

    fails() {
        return Object.keys(this.errors).length > 0;
    }

    setValidationRules() {
        let ruleObjects = this.getDefaultRules();
        let customRules = this.customRules();

        for(let rule in customRules) {
            ruleObjects[rule] = customRules[rule];
        }

        this.ruleObjects = ruleObjects;
    }

    getDefaultRules() {
        return {
            url     : Url,
            email   : Email,
            required: Required,
            phone   : Phone,
            min     : Min,
            max     : Max,
        };
    }

    customRules() {
        return {};
    }

}
