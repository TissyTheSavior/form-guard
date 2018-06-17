import Rule from "./Rule";

export default class Phone extends Rule {

    validate() {
        if(this.isNotAValidPhoneNumber()) {
            return this.getMessage();
        }
    }

    getMessage() {
        return 'please provide a valid phone number';
    }

    isNotAValidPhoneNumber() {
        let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/igm;
        return !regex.test(this.value)
    }


}