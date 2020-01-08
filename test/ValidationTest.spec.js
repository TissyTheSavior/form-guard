import expect    from 'expect';
import Validator from '../src/Validator';
import Field     from '../src/Field';


describe('ValidationTest', () => {

    it('Fails to validate with a rule set', () => {
        let form = {
            firstName: '',
            email: 'foo',
        };

        let rules = {
            firstName: ['required'],
            email: ['required', 'email'],
        };

        let validator      = new Validator(form, rules);
        let errors         = validator.validate();
        let expectedErrors = {
            firstName: ['the first name field is required'],
            email: ['please provide a valid email'],
        };

        expect(errors).toEqual(expectedErrors);

    });

    it('Can pass validation when requirements are met', () => {
        let form = {
            firstName: 'filled',
            email: 'aValid@email.address',
        };

        let rules = {
            firstName: ['required'],
            email: ['required', 'email'],
        };

        let validator = new Validator(form, rules);
        let errors    = validator.validate();

        expect(errors).toEqual({});

    });

    it('Can validate a single field', () => {

        let form = {
            firstName: '',
            email: 'not an email',
        };

        let rules = {
            firstName: ['required'],
            email: ['required', 'email'],
        };

        let validator = new Validator(form, rules);
        let errors    = validator.validateField('email');

        expect(errors).toEqual(['please provide a valid email']);
    });

    it('Can validate a single nested field', () => {

        let form = {
            user: {
                firstName: '',
                email: 'not an email',
            },
        };

        let rules = {
            user: {
                firstName: ['required'],
                email: ['required', 'email'],
            },
        };

        let validator = new Validator(form, rules);
        let errors    = validator.validateField('user.email');

        expect(errors).toEqual(['please provide a valid email']);
    });

    it('Can recursively validate', () => {
        let form = {
            user: {
                addresses: {
                    billing: {
                        street: '',
                        zip: '',
                    },
                    shipping: {
                        street: '',
                        zip: '',
                    },
                },
                firstName: '',
                lastName: '  ',
                email: 'not an email',
                password: '',
            },
            foo: '',
        };

        let rules = {
            user: {
                firstName: ['required'],
                lastName: ['required'],
                email: ['required', 'url'],
                password: ['required'],
                addresses: {
                    billing: {
                        street: ['required'],
                        zip: ['required'],
                    },
                    shipping: {
                        street: ['required'],
                        zip: ['required'],
                    },
                },
            },
            foo: ['required'],
        };

        let validator      = new Validator(form, rules);
        let errors         = validator.validate();
        let expectedErrors = {
            'foo': ['the foo field is required'],
            'user': {
                'addresses': {
                    'billing': {
                        'street': ['the street field is required'],
                        'zip': ['the zip field is required'],
                    },
                    'shipping': {
                        'street': ['the street field is required'],
                        'zip': ['the zip field is required'],
                    },
                },
                'email': ['The email is not a valid url'],
                'firstName': ['the first name field is required'],
                'lastName': ['the last name field is required'],
                'password': ['the password field is required'],
            },
        };


        expect(errors).toEqual(expectedErrors);

    });


    it('Can Set Errors with a parent field', () => {
        let validator          = new Validator();
        validator.parentfields = ['user'];
        validator.currentfield = new Field('name', '');
        let errors             = ['this is an error'];

        validator.nestErrorsInParent(errors);

        expect(validator.errors).toEqual({'user': {'name': ['this is an error']}});

    });

    it('Can Validate with options', () => {
        let form = {
            number1: 0,
            number2: 99,
        };

        let rules = {
            number1: ['min:1'],
            number2: ['max:20'],
        };

        let validator = new Validator(form, rules);

        let errors = validator.validate();

        expect(errors).toEqual({
            'number1': ['number 1 must not be less than 1'],
            'number2': ['number 2 must not be more than 20'],
        });
    });

    it.only('A closure can be a rule', () => {
        let form = {
            password: 'secret',
            password_confirm: 'not_the_same',
        };

        let rules = {
            password: ['required'],
            password_confirm: [
                'required',
                (field) => {
                    if(field.value != form.password) {
                        return 'passwords must match!'
                    }
                },
            ],
        };

        let validator      = new Validator(form, rules);
        let errors         = validator.validate();
        let expectedErrors = {
            password_confirm: ['passwords must match!'],
        };

        expect(errors).toEqual(expectedErrors);

        form      = {
            password: 'secret',
            password_confirm: 'secret',
        };
        validator = new Validator(form, rules);

        expect(validator.validate()).toEqual({});
    });


});
