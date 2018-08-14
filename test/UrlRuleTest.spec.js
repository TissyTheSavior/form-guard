import expect from 'expect';
import Url    from "../src/Url";

describe("Url rule test", () => {

    it('Can validate a url', () => {
        let rule = new Url('website', 'not a url');
        let message = rule.validate();

        expect(message).toBe('The website is not a valid url');

        rule.value = 'https://google.com';

        message = rule.validate();

        expect(message).toBe(undefined);
    });

});