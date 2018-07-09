import { lowerCase } from "lodash";

export default class Rule {

    constructor(fieldName, value, options = []) {
        this.fieldName = fieldName;
        this.value = value;
        this.options = options
    }

    getReadableFieldName() {
        return lowerCase(this.fieldName);
    }

}