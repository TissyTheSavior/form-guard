import Url      from "./Rules/Url";
import Email    from "./Rules/Email";
import Required from "./Rules/Required";
import Phone    from "./Rules/Phone";
import Min      from "./Rules/Min";
import Max      from "./Rules/Max";

export default class RulesCollection {

    constructor(rules) {
        this.extend(rules);
    }

    extend(rules) {
        for(let key in rules) {
            this[key] = rules[key];
        }
    }

    runValidationsAndGetErrors(ruleSet, field) {
        let errors = [];
        let rules = ruleSet.getRulesInField(field.name);

        for(let i in rules) {
            let error = this.makeRule(rules[i], field).validate();

            if(error !== undefined) {
                errors.push(error);
            }

        }

        return errors;
    }

    makeRule(key, field) {
        let options;
        [key, options] = RulesCollection.splitKeyFromOptions(key);

        return new this[key](field, options);
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