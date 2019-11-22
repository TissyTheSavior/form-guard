import expect   from 'expect';
import Required from "../src/Rules/Required";
import Field    from "../src/Field";

describe("Required Rules Test", () => {

    it('Fails to validate when a field is empty', () => {
        let rule = new Required(new Field('firstName', ''));

        let message = rule.validate();

        expect(message).toBe('the first name field is required');
    });

    it('Fails to validate when a field is required but has only whitespace \' \'', () => {
        let rule = new Required(new Field('firstName', '  \n'));

        let message = rule.validate();

        expect(message).toBe('the first name field is required');
    });

    it('Can validate a required number', () => {
        let rule = new Required(new Field('favoriteNumber', 0));
        let message = rule.validate();

        expect(message).toBe('the favorite number field is required');

        rule.value = 7;

        message = rule.validate();

        expect(message).toBe(undefined);
    });

    it('Can validate against undefined', () => {
        let rule = new Required(new Field('foo', undefined));
        let message = rule.validate();

        expect(message).toBe('the foo field is required');

        rule.value = 'bar';

        message = rule.validate();

        expect(message).toBe(undefined);
    });

    it('Returns undefined when the input is an unprocessable type', () => {
        let rule = new Required(new Field('someField', {}));

        let message = rule.validate();

        expect(message).toBe(undefined);
    });



});
