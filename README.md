# Form Guard
Form Guard is an object oriented form processing framework.

## Install with npm
```bash
npm install form-guard
# or
yarn add form-guard
```
## Usage
To make and process forms as simply as possible follow this pattern.
```js
import { Form } from 'form-guard';

class MyForm extends Form {

    constructor() {
        super();
        /* set up form inputs here */
        this.email = '';
    }

    rules() {
        return {
            /* create rules here */
            email: ['required', 'email']
        };
    }

    submit() {
        /* process form */
    }

}
```
### Rules
In the code above is a form with one input defined in the constructor called email.

Then there is the rules() method that returns an object with properties corresponding to the inputs you'd like to validate, lastly we have the rules we'd like to apply to that input, as an array.

So as you can simply see the email input is required, and must be an email address.

#### Available rules

At the moment there are a few common rules you can use out of the box.
##### required
Checks if the input has a value.
##### email
Checks if the input is an email address.
##### url
Checks if the input is a url ex: `https://github.com`
##### phone
Checks if the input is a phone number.
##### min
examples:
- 'min:6:chars' will check if the length of the input is 6 or more characters long.
- 'min:3:array' will check if the array length is 3 or more items long.
- 'min:10' will check if the input is equal to 10 or more.
##### max
- 'max:25:chars' will check if the length of the input is no more then 25 characters long.
- 'max:3:array' will check if the array length is no more then 3 items long.
- 'max:50' will check if the input is equal to 50 or less.
### The Validator
At this point we have a form and we defined a few rules. Now let's run the validator.

To run our validator just call the validate() method on the form.
```js
let myForm = new MyForm();

myForm.email = 'example@email.com';

myForm.validate();
```
After running the validate method we can look at our validator object.

To get the validator instance: `myForm.validator;`

To check if there are any failures: `validator.fails();`

To get an error from a field: `validator.getError('email');`

#### Example using JQuery
```js
$('#my-form').on('submit', function(e) {
    e.preventDefault();
    
    let myForm = new MyForm();
    
    myForm.email = $('#email-input').val();
    
    myForm.validate();
    
    if(myForm.validator.fails()) { // display error
       $('#error-message').html(myForm.validator.getError('email'));
       return; // exit function
    }
    
    myForm.submit(); //otherwise submit the form.
});
```
#### Example using Vue
Here is how you might do this in Vue. But, if you are using Vue I recommend building your forms with [vuetiful-forms](https://github.com/TissyTheSavior/vuetiful-forms) (My vue library for building forms with Vue + Form Guard)
```vue
<template>
    <form @submit.prevent="onSubmit">
        <label>
            Email: <span class="error">{{form.validator.getError('email')}}</span>
            <input v-model="form.email" type="text">
        </label>
        <button>submit</button>
    </form>
</template>

<script>
    export default {
        data() {
            return {
                form: new MyForm(),
            }
        },
        methods: {
            onSubmit() {
                this.form.validate();
                
                if(this.form.validator.fails()) {
                    return;
                }
                
                this.form.submit();
            }
        }
    }
</script>
```
## Nesting
You may also nest inputs and rules.
```js
constructor() {
    this.user = {
        name: '',
        email: '',
        password: '',
    }
    
}

rules() {
    return {
        user: {
            name: ['required'],
            email: ['required', 'email'],
            password: ['required', 'min:6'],
        }
    }
}
```
With nested inputs you can still get the errors from the validator with a dot syntax

`validator.getError('user.password);`