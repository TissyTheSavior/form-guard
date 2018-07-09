import expect   from 'expect';
import Required from "../src/Required";
import Email    from "../src/Email";
import Url      from "../src/Url";
import Phone    from "../src/Phone";


describe('RulesTest', () => {

    it('Fails to validate when a field is empty', () => {
        let rule = new Required('firstName', '');

        let message = rule.validate();

        expect(message).toBe('the first name field is required');
    });

    it('Fails to validate when a field is required but has only whitespace \' \'', () => {
        let rule = new Required('firstName', '  \n');

        let message = rule.validate();

        expect(message).toBe('the first name field is required');
    });

    it('Can validate a required number', () => {
        let rule = new Required('favoriteNumber', 0);
        let message = rule.validate();

        expect(message).toBe('the favorite number field is required');

        rule.value = 7;

        message = rule.validate();

        expect(message).toBe(undefined);
    });

    it('Can validate an Email', () => {
        let rule = new Email('email', 'not an email');
        let message = rule.validate();

        expect(message).toBe('please provide a valid email');

        rule.value = 'christian@statebuilt.com';

        message = rule.validate();

        expect(message).toBe(undefined);
    });

    it('Can validate a url', () => {
        let rule = new Url('website', 'not a url');
        let message = rule.validate();

        expect(message).toBe('The website is not a valid url');

        rule.value = 'https://google.com';

        message = rule.validate();

        expect(message).toBe(undefined);
    });

    it('Can validate a Phone', () => {
        let rule = new Phone('phone', '123');
        let message = rule.validate();

        expect(message).toBe('please provide a valid phone number');

        // * 555.555.5555
        // * 5555555555
        // * 555-555-5555
        // * 555.555.5555
        rule.value = '(555) 555-5555';

        message = rule.validate();

        expect(message).toBe(undefined);
    });

});