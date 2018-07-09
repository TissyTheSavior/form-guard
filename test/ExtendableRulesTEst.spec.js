import expect    from 'expect';
import Validator from "../src/Validator";


describe("Validation Rules can be extended", () => {

    class Foo {
        validate() {
            if(this.value !== 'foo') {
                return 'value must be foo';
            }
        }
    }

    class MyCustomValidator extends Validator {
        customRules() {
            return {
                foo: Foo,
            }
        }
    }

    it("Can have the custom rules", () => {
        let customValidator = new MyCustomValidator();

        expect(customValidator.ruleObjects).toHaveProperty('foo')
    });

    it("Will validate against custom rules", () => {
        let form = {
            foo: 'Not foo',
        };

        let rules = {
            foo: ['foo'],
        };

        let customValidator = new MyCustomValidator(form, rules);
        let errors = customValidator.validate();

        expect(errors).toEqual({
            foo: ['value must be foo'],
        });
    });
});