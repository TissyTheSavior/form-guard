import { lowerCase } from "lodash";

export default class Rule {

    constructor(fieldName, value, options = []) {
        this.currentfield = fieldName;
        this.value = value;
        this.options = options
    }

    getReadableFieldName() {
        return lowerCase(this.currentfield);
    }

}