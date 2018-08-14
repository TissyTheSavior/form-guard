import expect   from 'expect';
import Required from "../src/Required";

describe("Required Rules Test", () => {

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

    it('Returns undefined when the input is an unprocessable type', () => {
        let rule = new Required('someField', {});

        let message = rule.validate();

        expect(message).toBe(undefined);
    });

});