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


## Extend Validations

You may also write your own validation rules in 3 steps
1. Extend the Validator Class
2. Extend the Form Class
3. Write a CustomRule Class extending the Rule Class

Validator.js
```js
import { Validator as FormGuard } from 'form-guard';
import CustomRule from './CustomRule';

export default class Validator extends FormGuard {
        customRules() {
            return {
                customRule: CustomRule,
            }
        }
    }
```
First we import the validator and alias it so we can use the name for our custom validator.
Then we extend the validator and override the customRules method and add our custom rules.
So when we define our form's rules we can use this rule like so `myInputName: ['customRule]`
as you can see we are also importing and using a Class called CustomRule we'll get to that in just a second.

Form.js
```js
import { Form as FormGuard } from 'form-guard';
import Validator from './Validator'; // our custom Validator class

export default class Form extends FormGuard {
    getValidator() { //So by default we'll use our custom Validator Class when creating forms
        return new Validator();    
    }
}
```
To use this custom validator we need to have a Form Class that uses it.
So we first import our form-guard form, and alias it so we can use the name 'Form'.
Next we import our custom Validator Class, then override the getValidator method and return a new Validator().
This Custom Form Class is also useful if you'd like to have some custom functionality across all of your forms.

CustomRule.js
```js
import { Rule } from 'form-guard';

export default class CustomRule extends Rule {
    validate() {
        if(this.value !== 'foo') {
            return 'The value must be equal to foo'; // the error message
        }
    }
}
```
For our custom rule want to check if the input is equal to 'foo'.
To do that we define a CustomRule Class extending the Rule class.
For the CustomRule to work it must have a validate method.
if the validation fails we return a string that is the error message to display.

### Rules API
To be able to create, validate against rules, and display errors that make sense there are a few properties and methods at your disposal.

- value
 > The value of the input
- fieldName
 > The name you define in your form
- options
 > An array of options
 > ex: min:5:chars the nubmer 5 will be options[0] and chars will be options[1]
- getReadableFieldName()
 > will get a field name with spaces and all lower case. ex: firstName => first name
 
 
## Example Custom Rule
Let's say we have a field we want to be a Hex value for a color like #FFE609

So we extend our Validator.

Validator.js
```js
import { Validator as FormGuard } from 'form-guard';
import Hex from './Hex';

export default class Validator extends FormGuard {
        customRules() {
            return {
                hex: Hex,
            }
        }
    }
```
And Form

Form.js
```js
import { Form as FormGuard } from 'form-guard';
import Validator from './Validator'; // our custom Validator class

export default class Form extends FormGuard {
    getValidator() { //So by default we'll use our custom Validator Class when creating forms
        return new Validator();    
    }
}
```
Then we make our hex rule.

Hex.js
```js
import { Rule } from 'form-guard';

export default class Hex extends Rule {
    validate() {
        if(!this.isHexValue()){
            return this.getMessage();
        }
    }
    
    isHexValue() {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(this.value);
    }
    
    getMessage() {
        return "The "+ this.getReadableFieldName() + ' must be a valid hex value.';
    }
    
}
```

So all we do is check with a Regex if it's a hex value. Then return a message if it's not.

and in our form we define the rule like so: `feildName: ['hex']`

now what if we wanted to make sure the color was a shade of grey we could add an option to our rule.

Hex.js
```js
import { Rule } from 'form-guard';

export default class Hex extends Rule {
    validate() {
        if(!this.isHexValue()){
            return this.getMessage();
        }
        if(this.options[0] === 'grey' && ! this.isGrey()) {
            return "The "+ this.getReadableFieldName() + ' must be a shade of grey.';
        }
    }
    
    isHexValue() {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(this.value);
    }
    
    isGrey() {
        let red = this.value.substr(1, 2); //start after #
        let green = this.value.substr(3, 2);
        let blue = this.value.subtring(5, 2);
        
        return red === green === blue;
    }
    
    getMessage() {
        return "The "+ this.getReadableFieldName() + ' must be a valid hex value.';
    }
    
}
```

To use this in our form.

Color form.js
```js
import Form from './Form'; //our custom Form

export default class ColorForm extends Form {
    constructor() {
        super();
        this.color = '';
        this.grey = '';
    }
    
    rules() {
        return {
            color: ['required', 'hex'],
            grey: ['hex:grey'],
        }
    }
}
```

So now our color is required and must be hex, and we have an optional grey feild that must be a grey hex value.
