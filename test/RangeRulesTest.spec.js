import expect from 'expect';
import Min    from "../src/Rules/Min";
import Max    from "../src/Rules/Max";
import Field  from "../src/Field";


describe('RangeRulesTest', () => {


    it('Can Have A Minimum', () => {
        let rule = new Min(new Field('Age', 15), [18]);
        let message = rule.validate();

        expect(message).toBe("age must not be less than 18");

        rule.value = 18;

        message = rule.validate();

        expect(message).toBe(undefined);
    });

    it('Can Have A Minimum number of characters', () => {
        let rule = new Min(new Field('5 letter word', 'pear'), [5, 'chars']);
        let message = rule.validate();

        expect(message).toBe("5 letter word must not be less than 5 characters long");

        rule.value = 'apple';

        message = rule.validate();

        expect(message).toBe(undefined);
    });

    it('Can Have A Minimum number of items in array', () => {
        let rule = new Min(new Field('top3VideoGameFranchises', ['Elder Scrolls', 'Fallout']), [3, 'array']);
        let message = rule.validate();

        expect(message).toBe("top 3 video game franchises must not be less than 3 items");

        rule.value.push('Halo');

        message = rule.validate();

        expect(message).toBe(undefined);
    });

    it('Can Have A Maximum', () => {
        let rule = new Max(new Field('capacity', 240), [180]);
        let message = rule.validate();

        expect(message).toBe("capacity must not be more than 180");

        rule.value = 170;

        message = rule.validate();

        expect(message).toBe(undefined);
    });


    it('Can Have A Maximum number of characters', () => {
        let rule = new Max(new Field('5 digit zip code', '7875800'), [5, 'chars']);
        let message = rule.validate();

        expect(message).toBe("5 digit zip code must not be more than 5 characters long");

        rule.value = '78759';

        message = rule.validate();

        expect(message).toBe(undefined);
    });

    it('Can Have A Maximum number of items in array', () => {
        let rule = new Max(new Field('videoGameConsoles', ['xbox', 'ps4', 'pc', 'switch', 'wii u']), [4, 'array']);
        let message = rule.validate();

        expect(message).toBe("video game consoles must not be more than 4 items");

        rule.value.pop();

        message = rule.validate();

        expect(message).toBe(undefined);
    });



});