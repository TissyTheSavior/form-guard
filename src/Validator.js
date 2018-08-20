import RuleSet         from "./RuleSet";
import RulesCollection from "./RulesCollection";
import Field           from "./Field";

export default class Validator {

    constructor(form = {}, ruleSet = {}) {
        this.form = form;
        this.errors = {};
        this.ruleSet = new RuleSet(ruleSet);
        this.currentfield = '';
        this.parentfields = [];
        this.setValidationRules();
    }

    setCurrentField(name) {
        this.currentfield = new Field(name, this.getFieldValue(name));
    }

    validate() {
        this.setErrorsInRuleSet(this.ruleSet);

        return this.errors;
    }

    setErrorsInRuleSet(ruleSet) {
        for(let fieldName in ruleSet) {
            this.setCurrentField(fieldName);
            let errors = this.getErrorsInCurrentField(ruleSet);
            this.setErrors(errors);
        }
        this.parentfields.pop();
    }

    getErrorsInCurrentField(ruleSet) {
        if(ruleSet.isParentField(this.currentfield.name)) {
            this.validateChildRuleSet(ruleSet);
        }

        return this.ruleCollection.runValidationsAndGetErrors(ruleSet, this.currentfield);
    }

    validateChildRuleSet(ruleSet) {
        this.parentfields.push(this.currentfield.name);
        this.setErrorsInRuleSet(ruleSet.getRulesInField(this.currentfield.name));
    }

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

    setUpSingleFieldValidation(fieldName) {
        this.setCurrentField(fieldName);
        let ruleSet = this.ruleSet;

        if(fieldName.indexOf('.')) {
            let fieldNames = fieldName.split('.');
            this.setParentFields(fieldNames);
            this.setCurrentFieldNested(fieldNames);
            ruleSet = ruleSet.getNestedRuleSet(fieldNames);
        }
        return ruleSet;
    }

    setCurrentFieldNested(fieldNames) {
        this.setCurrentField(fieldNames[fieldNames.length - 1]);
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

        errors[this.currentfield.name] = [];
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
            this.errors[this.currentfield.name] = errors;
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
        errors[this.currentfield.name] = newErrors;
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
