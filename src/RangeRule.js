import Rule from "./Rule";

export default class RangeRule  extends Rule {

    validate() {

        if(this.options[1] != null) {
            switch(this.options[1]) {
                case 'chars':
                    return this.validateString();
                case 'array':
                    return this.validateArray();
            }
        }
        this.transformValuesIntoNumbers();
        return this.validateNumber();
    }

    validateNumber() {
        if(this.numberRule()) {
            return this.getMessage();
        }
    }

    validateString() {
        if(this.stringRule()) {
            return this.getMessage('characters long')
        }
    }

    validateArray() {
        if(this.arrayRule()) {
            return this.getMessage('items')
        }
    }

    transformValuesIntoNumbers() {
        this.value = Number(this.value);
        this.options[0] = Number(this.options[0]);
    }
}