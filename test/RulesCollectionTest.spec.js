import expect          from 'expect';
import RulesCollection from "../src/RulesCollection";
import Url             from "../src/Url";
import Email           from "../src/Email";

describe('Rules Collection Test', () => {

    it('Is made up of many Rule objects', () => {
        let rulesCollection = new RulesCollection({
            url  : Url,
            email: Email,
        });

        expect(rulesCollection).toHaveProperty('url');
    });

    it('Is and append new rules', () => {
        let rulesCollection = new RulesCollection({ url: Url });

        rulesCollection.extend({ email: Email });

        expect(rulesCollection).toHaveProperty('email');
    });

    it('Has can have a default list of rules', () => {
        let rulesCollection = RulesCollection.default();

        expect(rulesCollection).not.toBe(null);
    });

    it('Can get a rule from a key', () => {
        let rulesCollection = RulesCollection.default();

        let key = 'url';
        let field = 'website';
        let value = 'value';

        expect(rulesCollection.makeRule(key, field, value)).toHaveProperty('validate'); // all rules have a validate() method
    });

    it('Can get a rule with options', () => {
        let rulesCollection = RulesCollection.default();

        let key = 'min:3';
        let field = 'website';
        let value = 'value';

        let rule = rulesCollection.makeRule(key, field, value);

        expect(rule.options).toEqual(["3"]);

    });



});