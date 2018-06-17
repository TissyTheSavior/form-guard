import Rule from "./Rule";

export default class Email extends Rule {

    validate() {
        if(this.isNotAValidEmail()) {
            return this.getMessage();
        }
    }

    getMessage() {
        return 'please provide a valid email';
    }

    isNotAValidEmail() {
        let regex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,8}/igm;
        return !regex.test(this.value)
    }


}