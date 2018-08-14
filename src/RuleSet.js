export default class RuleSet {

    constructor(rules) {
        for(let key in rules) {
            this[key] = rules[key];
        }
    }

    getRulesInField(field) {
        return this.isParentField(field) ? new RuleSet(this[field]) : this[field];
    }

    isParentField(field) {
        return !Array.isArray(this[field]);
    }

    getNestedRuleSet(fields) {
        let ruleSet = this;
        for(let i = 0; i < fields.length - 1; i++) {
            ruleSet = ruleSet[fields[i]];
        }
        return new RuleSet(ruleSet);
    }
}