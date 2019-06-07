export default class Rule {

    constructor(field, options = []) {
        this.fieldName = field.name;
        this.value = field.value;
        this.options = options
    }

    getReadableFieldName() {
        let upperCaseOrNumberRegex = /([A-Z]+|\d+)/g;

        let replacer = function addSpaceAndLowerCaseChar(char) {
            return " " + char.toLowerCase()
        };

        return this.fieldName.replace(upperCaseOrNumberRegex, replacer).trim();
    }

}
