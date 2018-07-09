import expect from 'expect';
import Form   from "../src/Form";


describe('Test base form methods', () => {

    class MockForm extends Form {
        constructor() {
            super();
            this.inputs = ['initial value'];
            this.field = 'Foo';
        }
    }

});
