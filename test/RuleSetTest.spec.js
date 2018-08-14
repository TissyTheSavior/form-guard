
import expect  from 'expect';
import RuleSet from "../src/RuleSet";

describe("Rule Set Test", () => {

    it('A RuleSet accepts an object in it\'s constructor', () => {
        let rules = new RuleSet({
            foo: ['required'],
        });

        expect(rules.foo).toEqual(['required']);
    });

    it('Can get rules given a key', () => {
        let rules = new RuleSet({
            foo: ['required'],
        });

        expect(rules.getRulesInField('foo')).toEqual(['required']);
    });

    it('Returns a new RuleSet if the field is parent', () => {

    });

    it('Can check if it is a parent', () => {
        let rules = new RuleSet({
            foo: {
                bar: ['required'],
            },
        });

        expect(rules.isParentField('foo')).toEqual(true);
    });

    it('Can get a nested RuleSet', () => {
        let rules = new RuleSet({
            foo: {
                bar: {
                    baz: ['required'],
                },
            },
        });

        expect(rules.getNestedRuleSet(['foo', 'bar'])).toEqual({ bar: { baz: ['required'] }});

    });

});