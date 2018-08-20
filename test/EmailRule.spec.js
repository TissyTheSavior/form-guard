import expect from 'expect';
import Email  from "../src/Rules/Email";
import Field  from "../src/Field";

describe("Email Rule Test", () => {


    it('Can validate an Email', () => {
        let rule = new Email(new Field('email', 'not an email'));
        let message = rule.validate();

        expect(message).toBe('please provide a valid email');

        rule.value = 'christian@statebuilt.com';

        message = rule.validate();

        expect(message).toBe(undefined);
    });

});