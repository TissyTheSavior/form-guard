import expect from 'expect';
import Form   from "../src/Form";


describe('Test base form methods', () => {

    class MockForm extends Form {
        constructor() {
            super();
            this.foo = '';
        }

        rules() {
            return {
                foo: ['required']
            }
        }
    }

    it('Can get the validation errors', () => {
        let form = new Form();
        form.validator.errors = { foo: ['bar'] };

        expect(form.getValidationErrors()).toEqual({ foo: ['bar'] });
    });

    it('Can get a single error from a field', () => {
        let form = new Form();
        form.validator.errors = { foo: ['error message'] };

        expect(form.getErrorOnField('foo')).toEqual('error message');
    });

    it('Can use the validator to validate it\'s inputs', function() {
        let form = new MockForm();

        form.validate();

        expect(form.getValidationErrors()).toEqual({ foo: ['the foo field is required'] });
    });

    it('Can validate a single field', () => {
        let form = new MockForm();

        form.validateField('foo');

        expect(form.getErrorOnField('foo')).toEqual('the foo field is required');
    });

});
