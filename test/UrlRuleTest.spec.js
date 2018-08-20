import expect from 'expect';
import Url    from "../src/Rules/Url";
import Field  from "../src/Field";

describe("Url rule test", () => {

    it('Can validate a url', () => {
        let rule = new Url(new Field('website', 'not a url'));
        let message = rule.validate();

        expect(message).toBe('The website is not a valid url');

        rule.value = 'https://google.com';

        message = rule.validate();

        expect(message).toBe(undefined);
    });

});