import Rule         from "./Rule";
import {capitalize} from 'lodash';

export default class Required extends Rule {

    validate() {
        let type = capitalize(typeof this.value);
        return this.tryHandleType(type);
    }

    handleString() {
        if(this.value.trim() === '') {
            return this.getMessage();
        }
    }

    handleNumber() {
        if(this.value <= 0) {
            return this.getMessage();
        }
    }

    handleUndefined() {
        return this.getMessage();
    }

    getMessage() {
        return 'the ' + this.getReadableFieldName() + ' field is required'
    }

    tryHandleType(type) {
        let methodName = 'handle'+type;
        if(typeof this[methodName] !== 'function') {
            console.warn('Could not validate against the type of ' + type + '.', 'accepted types are String and Number');
            return;
        }
        return this[methodName]();
    }

}
