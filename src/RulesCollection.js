import Url      from "./Url";
import Email    from "./Email";
import Required from "./Required";
import Phone    from "./Phone";
import Min      from "./Min";
import Max      from "./Max";

export default class RulesCollection {

    constructor(rules) {
        this.extend(rules);
    }

    extend(rules) {
        for(let key in rules) {
            this[key] = rules[key];
        }
    }

    makeRule(key, field, value) {
        let options;
        [key, options] = RulesCollection.splitKeyFromOptions(key);

        return new this[key](field, value, options);
    }

    static splitKeyFromOptions(key) {
        let options;
        if(key.indexOf(':')) {
            options = key.split(':');
            key = options.splice(0, 1)[0];
        }
        return [key, options];
    }

    static default() {
        return new this({
            url     : Url,
            email   : Email,
            required: Required,
            phone   : Phone,
            min     : Min,
            max     : Max,
        });
    }

}