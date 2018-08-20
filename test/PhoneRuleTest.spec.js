import expect from 'expect';
import Phone  from "../src/Rules/Phone";
import Field  from "../src/Field";

describe('Phone Rule Test', () => {

    it('Can validate a Phone', () => {
        let rule = new Phone(new Field('phone', '123'));
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