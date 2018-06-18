import RangeRule from "./RangeRule";

export default class Max extends RangeRule {

    getMessage(appendedMessage = '') {
        let message = this.getReadableFieldName() +
                      ' must not be more than ' +
                      this.options[0];
        if(appendedMessage !== '') {
            message += ' ' + appendedMessage;
        }
        return message;
    }

    numberRule() {
        return this.value > this.options[0];
    }

    stringRule() {
        return this.value.length > this.options[0];
    }

    arrayRule() {
        return this.value.length > this.options[0];
    }

}