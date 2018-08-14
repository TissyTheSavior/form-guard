import RuleSet         from "./RuleSet";
import RulesCollection from "./RulesCollection";

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
     * Validates a single field given a field name
     * @param fieldName String
     * @returns {*}
     */
    validateField(fieldName) {
        let errors;
        let ruleSet = this.setUpSingleFieldValidation(fieldName);

        errors = this.getErrorsInCurrentField(ruleSet);

        this.setErrors(errors);
        if(errors.length < 1) {
            this.removeErrorFromCurrentField();
        }

        return errors;
    }

    /**
     * Normalizes field data given nested field name
     * @param fieldName
     * @returns {RuleSet}
     */
    setUpSingleFieldValidation(fieldName) {
        this.currentfield = fieldName;
        let ruleSet = this.ruleSet;

        if(fieldName.indexOf('.')) {
            let fieldNames = fieldName.split('.');
            this.setCurrentFieldNested(fieldNames);
            this.setParentFields(fieldNames);
            ruleSet = ruleSet.getNestedRuleSet(fieldNames);
        }
        return ruleSet;
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

        return new this.ruleCollection[key](this.currentfield, this.getFieldValue(this.currentfield), options);
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
        let ruleCollection = RulesCollection.default();
        ruleCollection.extend(this.customRules());

        this.ruleCollection = ruleCollection;
    }

    customRules() {
        return {};
    }

}
