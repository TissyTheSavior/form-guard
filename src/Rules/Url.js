import Rule from "./Rule";

export default class Url extends Rule {


    validate() {
        if(this.isNotAUrl()) {
            return this.getMessage();
        }
    }


    getMessage() {
        return 'The ' + this.getReadableFieldName() + ' is not a valid url';
    }


    isNotAUrl() {
        let regex = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
        return !regex.test(this.value);
    }


}