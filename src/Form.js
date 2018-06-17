import Validator from "./Validator";

export default class Form {

    constructor() {
        this.validator = new Validator(this, this.rules());
    }

    getValidationErrors() {
        return this.validator.errors;
    }

    validate() {
        this.validator = new Validator(this, this.rules());
        this.validator.validate();
    }

    validateField(fieldName) {
        let errors = this.getValidationErrors();

        this.validator = new Validator(this, this.rules());
        this.validator.errors = errors;

        this.validator.validateField(fieldName);
    }

    rules() {
        return {};
    }


    pushItem(property, value) {
        this[property].push(value);
    }

    detachItem(property, index) {
        this[property].splice(index, 1);
    }

    update(field, value) {
        this[field] = value;
    }

}