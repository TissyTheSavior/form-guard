import Validator from "./Validator";

export default class Form {

    constructor() {
        this.validator = this.getValidator();
    }

    getValidator() {
        return new Validator(this, this.rules());
    }

    getValidationErrors() {
        return this.validator.errors;
    }

    validate() {
        this.validator = this.getValidator();
        this.validator.validate();
    }

    validateField(fieldName) {
        let errors = this.getValidationErrors();

        this.validator = this.getValidator();
        this.validator.errors = errors;

        this.validator.validateField(fieldName);
    }

    getErrorOnField(fieldName) {
        return this.validator.getError(fieldName);
    }

    rules() {
        return {};
    }

}