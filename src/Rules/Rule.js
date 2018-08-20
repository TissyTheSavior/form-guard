import { lowerCase } from "lodash";

export default class Rule {

    constructor(field, options = []) {
        this.fieldName = field.name;
        this.value = field.value;
        this.options = options
    }

    getReadableFieldName() {
        return lowerCase(this.fieldName);
    }

}